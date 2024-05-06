import logging
import discord


from discord.ext import commands
from discord.ext.commands import Context
from pprint import pprint as p

import sys
import re

sys.path.append("..")

from api.socket import SocketMessenger

from errors import ChannelNotFound, NoArgumentsPassed, MemberNotFound

from .components.say import Say
from .components.get_channel import GetChannel
from .components.clear_messages import ClearMessages
from .components.kick_user import KickUser
from .components.print import Print


class NonePlaceholder:
    def __getattr__(self, attr_name):
        return "`undefined`"

    def __str__(self) -> str:
        return "`undefined`"


class NodeToCode:
    def __init__(self) -> None:

        self.parameter_types = {
            1: discord.Member,
            2: discord.TextChannel,
            3: str,
            4: int,
            5: discord.Role,
            6: discord.Guild,
            7: discord.User,
        }

        self.parameter_converters = {
            value: lambda _key=key: (
                lambda ctx, arg: self.convert_parameter(ctx, arg, _key)
            )
            for key, value in self.parameter_types.items()
        }

    async def convert_parameter(self, ctx, arg, key):

        if key in [3, 4]:
            return self.parameter_types.get(key)(arg)
        else:
            converter = getattr(
                commands, f"{self.parameter_types.get(key).__name__}Converter"
            )

            return await converter().convert(ctx, arg)

    def parse(self, data):
        """

        {
            "commands": {
                    "command_id": {
                        "name": command_name
                        "id": command_node_id
                        "description: description
                        "params": [
                            {
                                "paramName": parameter_name
                                "paramType": parameter_type
                                "required": is_required(bool)
                            }
                        ]

                        "actions": [
                            {
                                'id': node_id,
                                'type': action_type,
                                'data': [],

                            },
                            ...
                        ]
                    }

                },
            "events": [],

        }
        """

        self.data = {
            "commands": {},
            "events": [],
        }

        for node in data["nodes"]:
            if node["type"] == "command":  # Found a command

                # logging.info(
                #     f"Found command {node['id']} - {node['data']['command_name']}"
                # )

                self.data["commands"][node["id"]] = {
                    "name": node["data"]["command_name"],
                    "id": node["id"],
                    "description": node["data"].get("description", None),
                    "parameters": (
                        self.parse_parameters(node["data"]["parameters"])
                        if node["data"]["parameters"]
                        else None
                    ),
                    "actions": self.get_actions(data, node["id"]),
                }

            elif node["type"] == "event":  # Found an event
                ...  # TODO: Implement event support

        p(self.data)

        return self.data

    def parse_parameters(self, params: list):
        data = []

        for parameter in params:
            data.append(
                [
                    parameter["paramName"],
                    self.parameter_types.get(parameter["paramType"]),
                    parameter["required"],
                ]
            )

        return data

    async def parse_arguments(self, parameters: list, arguments: str, ctx: Context):

        parsed_arguments = []

        if not parameters:  # No parameters created in command

            print("No params")
            return parsed_arguments

        is_required_count = sum(params.count(True) for params in parameters)

        if (is_required_count > 0 and arguments == None) or (
            is_required_count > 0 and not len(arguments.split(" ")) >= is_required_count
        ):
            raise NoArgumentsPassed(
                f"No arguments passed, or is missing a required argument. {is_required_count} parameters are required!",
                ctx.command_node,
            )

        if arguments:

            args = []

            last_index = 0

            quoted_args = re.findall(
                r"'(.*?)'", arguments
            )  # find  all strings between single quotes

            non_quoted_args = re.sub(
                r"'(.*?)'", "", arguments
            ).split()  # separate the non-quoted ones and split

            _arguments = (
                quoted_args + non_quoted_args
            )  # I'm not sure if i'm doing this right but it works

            p(f"_arguments: {_arguments}")

            i = 1

            for param_i, arg in enumerate(_arguments):

                if i == len(parameters):  # Last parameter, consume all

                    start_index = arguments.index(arg, last_index)

                    args.append((arguments[start_index:], parameters[param_i][1]))
                    break

                i += 1
                args.append((arg, parameters[param_i][1]))

                last_index = arguments.index(arg, last_index) + len(arg)

            if len(args) != len(parameters) and not len(args) > len(parameters):
                while len(args) != len(parameters):  # FIll in the missing arguments
                    args.append(("", None))

            p(f"args: {args}")
            p(f"parameters: {parameters}")

            for i, (argument, argument_type) in enumerate(args):

                parameter_name = parameters[i][0]
                parameter_type = parameters[i][1]

                if argument:

                    if argument_type == parameter_type:

                        print(parameter_type, parameter_name)

                        if parameter_type == str:
                            argument = argument
                        else:
                            argument = argument.strip()

                        parsed_arguments.append(
                            (
                                parameter_name,
                                await self.parameter_converters.get(parameter_type)()(
                                    ctx, argument
                                ),
                            )
                        )

                else:
                    parsed_arguments.append((parameter_name, NonePlaceholder()))

        else:
            parsed_arguments = list(
                map(lambda param: (param[0], NonePlaceholder()), parameters)
            )

        return parsed_arguments

    def get_actions(self, data, node_id):

        tree = []

        def build_tree(
            child_action,
        ):

            tree.append(child_action)

            for edge in self.get_edges_of_action(data, child_action["id"]):
                for action in self.get_actions_with_edge(data, edge["target"]):
                    build_tree(
                        action,
                    )

        for edge in self.get_edges_of_action(data, node_id):  # First time
            for action in self.get_actions_with_edge(data, edge["target"]):
                build_tree(action)

        return tree  # TODO: Improve this code? if it works it works

    def get_edges_of_action(self, data, node_id):
        _edges = []

        for edge in data["edges"]:
            if node_id in edge["source"]:
                _edges.append(edge)

        return _edges

    def get_actions_with_edge(self, data, target_id):

        actions = []

        for node in data["nodes"]:
            if node["id"] == target_id:
                actions.append(
                    {
                        "id": node["id"],
                        "type": node["type"],
                        "data": node["data"],
                    }
                )

        return actions

    async def create_callback(
        self,
        context: Context,
        command: dict,
        arguments: str,
        messenger: SocketMessenger,
    ):

        context.command_node = command["name"]

        arguments = await self.parse_arguments(
            command["parameters"], arguments, ctx=context
        )

        if not arguments:
            arguments = [("context", context)]
        else:

            arguments = arguments + [("context", context)]

        executions = []

        variables = {}

        for action in command["actions"]:

            if action["type"] == "say":

                variable = action["data"].get("variables", [])

                if variable:
                    if not variables.get(variable[0], None):
                        raise ChannelNotFound(message=variable[0], node=action["id"])
                    else:
                        action["data"]["channel"] = variables[variable[0]]
                else:

                    action["data"]["channel"] = context.channel

                say_action = Say(
                    context=context,
                    command_data=action["data"],
                    arguments=arguments,
                )

                executions.append(say_action)

            elif action["type"] == "get_channel":

                channel_action = GetChannel(context, action["data"]["text"], arguments)

                variables[action["id"]] = await channel_action.execute()

            elif action["type"] == "clear_messages":

                variable = action["data"].get("variables", [])

                if variable:
                    if not variables.get(variable[0], None):
                        raise ChannelNotFound(message=variable[0], node=action["id"])
                    else:
                        action["data"]["channel"] = variables[variable[0]]
                else:

                    action["data"]["channel"] = context.channel

                clear_msgs = ClearMessages(context, action["data"], arguments)
                executions.append(clear_msgs)

            elif action["type"] == "kick_user":
                variable = action["data"].get("variables", [])

                if variable:
                    if not variables.get(variable[0], None):
                        raise MemberNotFound(message=variable[0], node=action["id"])
                    else:
                        action["data"]["member"] = variables[variable[0]]

                kick_user = KickUser(context, action["data"], arguments)
                executions.append(kick_user)

            elif action["type"] == "print":
                print_ = Print(
                    context, action["data"], arguments, messenger, action["id"]
                )
                executions.append(print_)

        async def callback(**kwargs):
            prev_result = None

            for cmd in executions:  # MY attempt to chain the resultants of each action
                # BUG: Fix different tree resultants bug

                if (
                    isinstance(prev_result, discord.Message)
                    and not cmd.command_data["variables"]
                ):
                    prev_result = await cmd.execute(
                        channel=prev_result.channel,
                    )

                    continue

                elif (
                    isinstance(prev_result, discord.TextChannel)
                    and not cmd.command_data["variables"]
                ):
                    prev_result = await cmd.execute(
                        channel=prev_result,
                    )

                    continue

                prev_result = await cmd.execute()

        return callback

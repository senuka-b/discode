import logging

from discord.ext.commands import Context
from pprint import pprint as p

import sys

sys.path.append("..")

from errors import ChannelNotFound

from .components.say import Say
from .components.get_channel import GetChannel


class NodeToCode:
    def __init__(self) -> None:
        self.data = {
            "commands": {},
            "events": [],
        }

    def parse(self, data):
        """

        {
            "commands": {
                    "command_id": {
                        "name": command_name
                        "description: description

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

        for node in data["nodes"]:
            if node["type"] == "command":  # Found a command

                # logging.info(
                #     f"Found command {node['id']} - {node['data']['command_name']}"
                # )

                self.data["commands"][node["id"]] = {
                    "name": node["data"]["command_name"],
                    "description": node["data"].get("description", None),
                    "actions": self.get_actions(data, node["id"]),
                }

            elif node["type"] == "event":  # Found an event
                ...  # TODO: Implement event support

        return self.data

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
                    {"id": node["id"], "type": node["type"], "data": node["data"]}
                )

        return actions

    async def create_callback(self, context: Context, command: dict):

        executions = []

        variables = {}

        for action in command["actions"]:

            if action["type"] == "say":

                p(variables)

                variable = action["data"].get("variables", [])

                if variable:
                    if not variables[variable[0]]:
                        raise ChannelNotFound(message=variable[0])
                    else:
                        action["data"]["channel"] = variables[variable[0]]

                say_action = Say(command_data=action["data"])

                executions.append(say_action)

            elif action["type"] == "get_channel":

                channel = await GetChannel(context, action["data"]["text"]).execute()

                variables[action["id"]] = channel

        async def callback(**kwargs):
            [await cmd.execute(**kwargs) for cmd in executions]

        return callback

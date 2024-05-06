import threading
import discord, datetime, aiohttp, traceback, os, logging, typing, asyncio

from pprint import pprint as p

from discord.ext import commands


import os

from bot.cogs.general import General
from nodetocode.nodetocode import NodeToCode
from api.socket import SocketMessenger

from errors import ChannelNotFound, NoArgumentsPassed

node_to_code = NodeToCode()

from functools import wraps


class DiscodeBot(commands.Bot):
    client: aiohttp.ClientSession
    _uptime: datetime.datetime = datetime.datetime.utcnow()

    def __init__(
        self,
        prefix: str = ".",
        ext_dir: str = "bot.cogs",
        *args: typing.Any,
        **kwargs: typing.Any,
    ) -> None:
        intents = discord.Intents.default()
        intents.members = True
        intents.message_content = True
        super().__init__(
            *args,
            **kwargs,
            command_prefix=commands.when_mentioned_or(prefix),
            intents=intents,
            case_insensitive=True,
        )
        self.logger = logging.getLogger(self.__class__.__name__)
        self.ext_dir = ext_dir
        self.synced = False
        self.is_running = False

    async def on_error(
        self, event_method: str, *args: typing.Any, **kwargs: typing.Any
    ) -> None:
        self.logger.error(
            f"An error occurred in {event_method}.\n{traceback.format_exc()}"
        )

    async def on_ready(self) -> None:
        self.logger.info(f"Logged in as {self.user} ({self.user.id})")

    async def setup_hook(self) -> None:
        self.client = aiohttp.ClientSession()

        if not self.synced:
            await self.tree.sync()
            self.synced = not self.synced
            self.logger.info("Synced command tree")

    def run(self, token: str, *args: typing.Any, **kwargs: typing.Any) -> None:

        try:
            super().run(token, *args, **kwargs)
            return self
        except (discord.LoginFailure, KeyboardInterrupt):
            self.logger.info("Exiting...")
            exit()

    async def _start(self, data: dict):
        token = data["bot_token"]

        self.command_prefix = commands.when_mentioned_or(data["default_command_prefix"])

        self.bot_thread = threading.Thread(target=self.run, args=(token,))
        self.bot_thread.start()

        self.is_running = True

        print("REAched here")

    @property
    def user(self) -> discord.ClientUser:
        assert super().user, "Bot is not ready yet"
        return typing.cast(discord.ClientUser, super().user)

    @property
    def uptime(self) -> datetime.timedelta:
        return datetime.datetime.utcnow() - self._uptime

    async def create_command(self, messenger: SocketMessenger, _command: dict):

        p(_command)

        @commands.command(
            name=_command["name"], description=_command["description"] or ""
        )
        async def custom_command(ctx: commands.Context, *, arguments: str = None):
            try:

                callback = await node_to_code.create_callback(
                    context=ctx,
                    command=_command,
                    arguments=arguments,
                    messenger=messenger,
                )

            except ChannelNotFound as e:
                messenger.error(message=e.message)
                return

            except NoArgumentsPassed as e:
                messenger.error(message=e.message, node=e.command_node)
                return

            await callback()

        try:

            self.add_command(custom_command)

        except commands.CommandRegistrationError as e:
            self.remove_command(e.name)
            self.add_command(custom_command)

    def validate_commands_and_events(
        self,
    ):

        self.recursively_remove_all_commands()

        deleted_events = {}  # TODO remove events

import discord, datetime, aiohttp, traceback, os, logging, typing

from discord.ext import commands

from dotenv import load_dotenv
import os

from bot.cogs.general import General
from nodetocode.nodetocode import NodeToCode

from errors import ChannelNotFound

node_to_code = NodeToCode()


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

    async def _load_extensions(self) -> None:

        for filename in os.listdir("bot/cogs"):
            if filename.endswith(".py") and not filename.startswith("_"):
                try:
                    await self.load_extension(f"{self.ext_dir}.{filename[:-3]}")

                    self.logger.info(f"Loaded extension {filename[:-3]}")
                except commands.ExtensionError:
                    self.logger.error(
                        f"Failed to load extension {filename[:-3]}\n{traceback.format_exc()}"
                    )

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
        await self._load_extensions()
        if not self.synced:
            await self.tree.sync()
            self.synced = not self.synced
            self.logger.info("Synced command tree")

    def run(self, *args: typing.Any, **kwargs: typing.Any) -> None:
        load_dotenv()
        try:
            super().run(str(os.getenv("TOKEN")), *args, **kwargs)
            return self
        except (discord.LoginFailure, KeyboardInterrupt):
            self.logger.info("Exiting...")
            exit()

    @property
    def user(self) -> discord.ClientUser:
        assert super().user, "Bot is not ready yet"
        return typing.cast(discord.ClientUser, super().user)

    @property
    def uptime(self) -> datetime.timedelta:
        return datetime.datetime.utcnow() - self._uptime

    async def create_command(self, trigger_error, _command: dict):

        @commands.command(name=_command["name"])
        async def custom_command(ctx: commands.Context):
            try:
                callback = await node_to_code.create_callback(
                    context=ctx, command=_command
                )
            except ChannelNotFound as e:
                trigger_error(e.message)

            await callback()

        try:
            self.add_command(custom_command)

        except commands.CommandRegistrationError as e:
            self.remove_command(e.name)
            self.add_command(custom_command)

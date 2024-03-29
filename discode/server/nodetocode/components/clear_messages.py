from .base_command import BaseCommand
import discord
from discord.ext.commands import Context


class ClearMessages(BaseCommand):
    def __init__(self, context: Context, command_data: dict, arguments: list):
        self.command_data = command_data

        self.text = command_data.get("text", "")
        self.channel = command_data["channel", ""]

        self.arguments = arguments

    async def execute(self, **kwargs):

        if self.arguments:

            self.text = self.text.format(**dict(self.arguments))

        if kwargs.get("channel", None):

            return await kwargs.get("channel").purge(limit=int(self.text))

        return await self.channel.purge(limit=int(self.text))

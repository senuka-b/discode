from .base_command import BaseCommand
import discord
from discord.ext.commands import Context


class Say(BaseCommand):
    def __init__(self, context: Context, command_data: dict):
        self.command_data = command_data

        self.text = command_data["text"]
        self.channel = command_data["channel"]

    async def execute(self, **kwargs):
        if kwargs.get("channel", None):
            print("CHANNELF OUND")

            return await kwargs.get("channel").send(self.text)
        return await self.channel.send(self.text)

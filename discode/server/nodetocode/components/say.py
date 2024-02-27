from .base_command import BaseCommand
import discord
from discord.ext.commands import Context


class Say(BaseCommand):
    def __init__(self, command_data: dict):
        self.command_data = command_data

        self.text = command_data["text"]
        self.channel = command_data["channel"]

    async def execute(self):
        await self.channel.send(self.text)

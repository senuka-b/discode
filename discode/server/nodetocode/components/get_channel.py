from .base_command import BaseCommand
import discord
from discord.ext.commands import Context


class GetChannel(BaseCommand):
    def __init__(self, context: Context, channel):

        self.context = context
        self.channel = channel

    async def execute(self):

        if self.channel.isnumeric():
            self.channel = int(self.channel)

            return self.context.guild.get_channel(self.channel)

        return discord.utils.get(self.context.guild.channels, name=self.channel)

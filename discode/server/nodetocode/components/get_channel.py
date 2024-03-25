from .base_command import BaseCommand
import discord
from discord.ext.commands import Context


class GetChannel(BaseCommand):
    def __init__(self, context: Context, channel, arguments):

        self.arguments = arguments

        self.context = context
        self.channel = channel

    async def execute(self):

        if self.arguments:
            self.channel = self.channel.format(**dict(self.arguments))

        if self.channel.isnumeric():
            self.channel = int(self.channel)

            return self.context.bot.get_channel(self.channel)

        return discord.utils.get(self.context.guild.text_channels, name=self.channel)

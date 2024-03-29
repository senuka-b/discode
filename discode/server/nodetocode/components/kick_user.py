from .base_command import BaseCommand
import discord
from discord.ext.commands import Context


class KickUser(BaseCommand):
    def __init__(self, context: Context, command_data: dict, arguments: list):

        self.command_data = command_data

        self.context = context
        self.text = command_data.get("text", "")
        self.reason = command_data.get("reason", "")
        self.member = command_data.get("member", None)

        self.arguments = arguments

    async def execute(self, **kwargs):

        if self.arguments:
            self.text = self.text.format(**dict(self.arguments))
            self.reason = self.reason.format(**dict(self.arguments))

        if self.text.isnumeric():
            self.member = int(self.text)

            return await self.context.guild.get_member(self.member).kick(
                reason=self.reason
            )

        if kwargs.get("member", None):

            return await kwargs.get("member").kick(reason=self.reason)

        return await self.member.kick(reason=self.reason)

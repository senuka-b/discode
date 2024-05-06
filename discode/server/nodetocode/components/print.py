from .base_command import BaseCommand
import discord
from discord.ext.commands import Context

from api.socket import SocketMessenger


class Print(BaseCommand):
    def __init__(
        self,
        context: Context,
        command_data: dict,
        arguments: list,
        messenger: SocketMessenger,
        node_id: str,
    ):
        self.command_data = command_data

        self.text = command_data.get("text", "")

        self.arguments = arguments
        self.messenger = messenger
        self.node_id = node_id

    async def execute(self, **kwargs):

        if self.arguments:

            self.text = self.text.format(**dict(self.arguments))

        print("Printing ", self.text)
        self.messenger.print(message=self.text, node=self.node_id)

from discord.ext import commands


class BaseCommand:
    def __init__(
        self,
        command_name: str,
        command_context: commands.Context,
    ):
        self.command_name = command_name
        self.command_context = command_context

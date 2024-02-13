import discord
from discord.ext import commands

from dotenv import load_dotenv

load_dotenv()
import os


class DiscodeBot(commands.Bot):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)


def run_bot():
    bot = DiscodeBot(command_prefix="!", intents=discord.Intents.all())
    bot.run(os.getenv("TOKEN"))

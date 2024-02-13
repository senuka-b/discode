import discord
from discord.ext import commands

class DiscodeBot(commands.Bot):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        
    
    
    
def run_bot():
    bot = DiscodeBot(command_prefix="!", intents=discord.Intents.all())
    bot.run("MTIwNTUwMTcwMjMyOTg2MDE2Ng.Gef9Y-.taS2DlkGGO5Qp_LQZUTZcGF8OZxHvoYH_XuVjg")
        

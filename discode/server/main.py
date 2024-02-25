from api.api import run_api
from bot.bot import run_bot


import threading, os, discord


from bot.bot import DiscodeBot

bot = DiscodeBot()

bot_thread = threading.Thread(target=bot.run)

app_thread = threading.Thread(target=run_api, args=(bot,))

if __name__ == "__main__":

    app_thread.start()
    bot_thread.start()
    app_thread.join()
    bot_thread.join()

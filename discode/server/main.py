from api.api import run_api


import threading, os, discord


from bot.bot import DiscodeBot

bot = DiscodeBot()


app_thread = threading.Thread(target=run_api, args=(bot,))

if __name__ == "__main__":

    app_thread.start()
    app_thread.join()

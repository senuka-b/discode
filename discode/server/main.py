from api.api import run_api
from bot.bot import run_bot

import threading

# app_thread = threading.Thread(target=run_api)
# bot_thread = threading.Thread(target=run_bot)

if __name__ == "__main__":

    run_api()

    # app_thread.start()
    # # bot_thread.start()
    # app_thread.join()
    # # bot_thread.join()

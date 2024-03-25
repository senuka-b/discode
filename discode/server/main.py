from api.api import run_api


import threading, os, discord
from engineio.async_drivers import gevent


app_thread = threading.Thread(target=run_api)


if __name__ == "__main__":
    app_thread.start()
    app_thread.join()

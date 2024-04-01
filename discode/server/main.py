from api.api import run_api


import threading, os, discord, time, sys, signal, queue
from engineio.async_drivers import gevent


if __name__ == "__main__":

    run_api()

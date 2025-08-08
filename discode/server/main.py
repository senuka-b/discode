from api.api import run_api


from engineio.async_drivers import gevent


if __name__ == "__main__":
    print("Starting server...")
    run_api()

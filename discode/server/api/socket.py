from flask_socketio import SocketIO
from datetime import datetime


class SocketMessenger:
    def __init__(self, socket: SocketIO):
        self.socket = socket

    def _get_time(self):
        return datetime.now().strftime("[%H:%M:%S]")

    def create_log(self, message: str, node: str, type: str):
        self.socket.emit(
            "log",
            {"message": message, "node": node, "type": type, "time": self._get_time()},
        )

    def error(self, message: str, node: str = None):
        self.create_log(message, node, "error")

    def print(self, message: str, node: str = None):
        self.create_log(message, node, "print")

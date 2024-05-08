from flask_socketio import SocketIO


class SocketMessenger:
    def __init__(self, socket: SocketIO):
        self.socket = socket

    def error(self, message: str, node: str = None):
        self.socket.emit("log", {"node": node, "message": message, "type": "error"})

    def print(self, message: str, node: str = None):
        self.socket.emit("log", {"node": node, "message": message, "type": "print"})

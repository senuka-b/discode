from flask_socketio import SocketIO


class SocketMessenger:
    def __init__(self, socket: SocketIO):
        self.socket = socket

    def error(self, message: str, node: str = None):
        self.socket.emit("error", {"node": node, "message": message})

    def print(self, message: str, node: str = None):
        self.socket.emit("message", {"node": node, "message": message})

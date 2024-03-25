class ChannelNotFound(Exception):
    def __init__(self, message: str, node: str, *args, **kwargs) -> None:
        super().__init__(message, *args, **kwargs)

        self.message = message
        self.node = node


class NoArgumentsPassed(Exception):
    def __init__(self, message: str, command: str, *args, **kwargs) -> None:
        super().__init__(message, *args, **kwargs)

        self.message = message
        self.command_node = command

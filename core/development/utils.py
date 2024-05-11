import djclick


class ClickError(djclick.ClickException):
    """
    Basically the same as djclick.ClickException, but just with a different styling for message.
    """

    def __init__(self, message):
        super().__init__(message)

    def format_message(self):
        return djclick.style(self.message, fg="red", bold=True)

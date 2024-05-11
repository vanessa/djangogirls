import djclick
from django.conf import settings
from faker import Faker

from core.development.utils import ClickError

fake = Faker()


@djclick.command()
def command():
    if not settings.DEBUG:
        raise ClickError("Seeding is only allowed in DEBUG mode.")
    print("Hello from seed!")

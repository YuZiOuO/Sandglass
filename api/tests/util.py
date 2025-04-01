import random
from datetime import datetime


def now() -> float:
    return datetime.now().timestamp()


def random_timestamp_ms():
    """
    Generate a random millisecond timestamp.
    """
    random_time = random.uniform(0, now())
    return int(random_time * 1000)

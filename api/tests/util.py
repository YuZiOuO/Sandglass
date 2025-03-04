from datetime import datetime


def now() -> float:
    return datetime.now().timestamp()

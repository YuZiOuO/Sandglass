import hashlib

from mongoengine import get_db


def salting(original_str: str, salt: str) -> str:
    return hashlib.sha256((original_str + salt).encode()).hexdigest()


def transaction(func):
    def wrapper(*args, **kwargs):
        db = get_db()
        with db.client.start_session() as session:
            with session.start_transaction():
                try:
                    func(*args, **kwargs)
                except Exception as e:
                    session.abort_transaction()
                    return e

    return wrapper

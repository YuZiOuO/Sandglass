import hashlib
from typing import List

from bson import json_util
from mongoengine import get_db
from mongoengine.base import BaseList


def salting(original_str: str, salt: str) -> str:
    return hashlib.sha256((original_str + salt).encode()).hexdigest()

def transaction(func):
    """
    Decorator to define a transaction.
    :param func: the function represents the transaction.
    """
    def wrapper(*args, **kwargs):
        db = get_db()
        with db.client.start_session() as session:
            with session.start_transaction():
                try:
                    return func(*args, **kwargs)
                except Exception:
                    session.abort_transaction()
                    raise

    return wrapper


def dereference(list_of_reference: BaseList, dump=False) -> List[dict] | str:
    """
    Dereference a ListField of ReferenceField to a list of dict,
    if dump is True, return a json string.
    :param list_of_reference: The list to be dereferenced.
    :param dump: whether to dump the result to json string.
    :return: a list of dict or a json string.
    """
    result = list(
        map(
            lambda ref: get_db().dereference(ref.to_dbref()),
            list_of_reference
        )
    )
    if not dump:
        return result
    else:
        return json_util.dumps(result)

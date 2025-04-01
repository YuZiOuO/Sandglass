from functools import wraps

from flask import abort
from flask_jwt_extended import current_user


def authentication(func):
    """
    Use to wrap view function to indicate the client should be administrator.
    Assume the user has logged in.
    """

    @wraps(func)
    def wrapper(*args, **kwargs):
        if current_user.administrator:
            return func(*args, **kwargs)
        else:
            abort(401)

    return wrapper

# def authorization(func, res: Resource, permission: Permission):
#     """
#     Check if the user has appropriate permission to perform an action.
#     :param func: the view function to be wrapped.
#     :param res: the resource to be accessed.
#     :param permission: the permission level to perform an action.
#     :return: the wrapped function,with arguments `res` and `permission` passed.
#     """
#
#     @wraps(func)
#     def wrapper(*args, **kwargs):
#         return func(*args, **kwargs, res=res, permission=permission)
#
#     return wrapper

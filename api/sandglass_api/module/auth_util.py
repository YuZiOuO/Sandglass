from functools import wraps

from flask import abort
from flask_jwt_extended import current_user

from sandglass_api.models.access_control import AccessControlEntry, AccessControlList, Permission
from sandglass_api.models.resource import Resource
from sandglass_api.models.user import User


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


def authorization(func):
    """
    Use to wrap view function to indicate the user should be authorized,
    i.e. users must have access to the resource.Assume the token is valid.
    """

    @wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)

    return wrapper


def _get_acl(res: Resource) -> AccessControlList:
    """
    Return the original Access Control List of the resource.To modify, change the return value,then
    invoke `save()` method。
    :param res: to query.
    :return: An Access Control List Object.
    """
    return AccessControlList.objects(res=Resource).first()


def _get_ace(res: Resource, user: User) -> AccessControlEntry:
    """
    Return the Access Control Entry of the user to the given Resource.To modify, change the return value,then
    invoke `save()` method.
    :param res: to query.
    :param user: to query.
    :return: An Access Control Entry Object
    """
    acl: AccessControlList = _get_acl(res)

    # TODO: 是不是可以不要for-if
    for ace in acl.ACEs:
        if ace.user == user:
            return ace

    # If the user is not in the given ACL,create a new ACE.
    # TODO: improve:这样会导致新用户查询时增加记录
    new_ace = AccessControlEntry(user=user)
    acl.ACEs.append(new_ace)
    return new_ace


def authorize(res: Resource, user: User, permission: Permission) -> bool:
    """
    Check if the user has appropriate permission to perform an action.
    :param res: to be accessed.
    :param user: to perform action.
    :param permission: the permission level to perform an action
    :return: True if the user have grater access permission then give.
    """
    ace = _get_ace(res, user)
    return ace.permissions >= permission


def grant(res: Resource, user: User, permission: Permission) -> None:
    """
    **Modify** the user's access permission to the resource.
    :param res: to be accessed.
    :param user: to access the resource.
    :param permission: the new access permission to the resource
    """
    acl = _get_acl(res)
    ace = _get_ace(res, user)
    ace.permissions = permission
    acl.save()  # To save embedded document,save the document it embedded to

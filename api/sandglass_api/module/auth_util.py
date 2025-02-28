from functools import wraps

from flask import session

from sandglass_api.models.access_control import AccessControlEntry, AccessControlList, Permission
from sandglass_api.models.resource import Resource
from sandglass_api.models.user import Session, User


# This file defined two vital decorator which applies to routers

def authenticate(func):
    """
    Use to wrap view function to indicate the client should be authenticated,
    i.e. users must log in to perform the action.
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        sandglass_session = session['sandglass_session']
        session_obj = Session.from_json(sandglass_session)

        if session_obj in Session.objects(): # TODO: logics to be improved
            return func(*args, **kwargs)
        else:
            return "Authentication Failed"


    return wrapper

# TODO:这个decorator用来装饰需要admin权限的接口
def authorization(func):
    """
    Use to wrap view function to indicate the user should be authorized,
    i.e. users must have access to the resource.Assume that the client is authenticated,which means
    `@authenticate` should be wrapped previously when using this decorator.
    """
    @wraps(func)
    def wrapper(*args,**kwargs):
        sandglass_session = session['sandglass_session']
        session_obj = Session.from_json(sandglass_session)
        # mongoengine 在处理对 ListField 的查询时,_in关键字与其他字段是相反的逻辑
        # 这里相当于sessions__contain = session_obj

        # get the user in this session
        user = User.objects(sessions__in = [session_obj])

        # TODO:权限检查逻辑
        return func(*args,**kwargs)

    return wrapper

def _get_acl(res:Resource) -> AccessControlList:
    """
    Return the original Access Control List of the resource.To modify, change the return value,then
    invoke `save()` method。
    :param res: to query.
    :return: An Access Control List Object.
    """
    return AccessControlList.objects(res=Resource).first()

def _get_ace(res:Resource,user:User) -> AccessControlEntry:
    """
    Return the Access Control Entry of the user to the given Resource.To modify, change the return value,then
    invoke `save()` method.
    :param res: to query.
    :param user: to query.
    :return: An Access Control Entry Object
    """
    acl:AccessControlList = get_acl(res)

    # TODO: 是不是可以不要for-if
    for ace in acl.ACEs:
        if ace.user == user:
            return ace

    # If the user is not in the given ACL,create a new ACE.
    # TODO: improve:这样会导致新用户查询时增加记录
    new_ace = AccessControlEntry(user=user)
    acl.ACEs.append(new_ace)
    return new_ace

def authorize(res:Resource,user:User,permission:Permission) -> bool:
    """
    Check if the user has appropriate permission to perform an action.
    :param res: to be accessed.
    :param user: to perform action.
    :param permission: the permission level to perform an action
    :return: True if the user have grater access permission then give.
    """
    ace = _get_ace(res,user)
    return ace.permissions >= permission

def grant(res:Resource,user:User,permission:Permission) -> None:
    """
    **Modify** the user's access permission to the resource.
    :param res: to be accessed.
    :param user: to access the resource.
    :param permission: the new access permission to the resource
    """
    ace = _get_ace(res,user)
    ace.permissions = permission
    ace.save()


from enum import Enum

import mongoengine as me
from mongoengine import ReferenceField, EnumField, EmbeddedDocumentListField

from sandglass_api.models.resource import Resource
from sandglass_api.models.user import User


class Permission(Enum):
    NO_ACCESS = 0
    READ = 1
    WRITE = 2


class AccessControlEntry(me.EmbeddedDocument):
    user = ReferenceField(User, required=True)
    permissions = EnumField(Permission, required=True, default=Permission.NO_ACCESS)


class AccessControlList(me.Document):
    res = ReferenceField(Resource, required=True, unique=True)
    ACEs = EmbeddedDocumentListField(AccessControlEntry)  # 这里不用Reference,因为希望ACE失效时从数据库中删除.

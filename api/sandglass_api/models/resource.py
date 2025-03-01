import mongoengine as me
from mongoengine import ReferenceField

from sandglass_api.models.access_control import AccessControlList


class Resource(me.Document):
    meta = {'allow_inheritance': True}
    ACL = ReferenceField(AccessControlList, unique=True)

import mongoengine as me

from sandglass_api.models.user import User


# TODO:暂时不使用

class Resource(me.Document):
    meta = {'allow_inheritance': True}
    # ACL = EmbeddedDocumentField(AccessControlList, unique=True)
    owner = me.ReferenceField(User, required=True)

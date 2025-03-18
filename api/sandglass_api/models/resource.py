from datetime import datetime

import mongoengine as me

from sandglass_api.models.user import User


class Resource(me.Document):
    meta = {'allow_inheritance': True}
    # ACL = EmbeddedDocumentField(AccessControlList, unique=True)
    owner = me.ReferenceField(User, required=True)
    created_at = me.DateTimeField(default=datetime.now())

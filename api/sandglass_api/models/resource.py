from datetime import datetime

import mongoengine as me

from sandglass_api.models.user import User


class Resource(me.Document):
    """
    used to store metadata of a resource.
    """
    meta = {'allow_inheritance': True}
    # ACL = EmbeddedDocumentField(AccessControlList, unique=True)
    owner = me.ReferenceField(User, required=True)  # should not be provided by user
    created_at = me.DateTimeField(default=datetime.now())  # should not be provided by user

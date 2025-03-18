from datetime import datetime

import mongoengine as me


class Attachment(me.EmbeddedDocument):
    name = me.StringField(required=True)
    url = me.URLField(required=True)
    created_at = me.DateTimeField(default=datetime.now())

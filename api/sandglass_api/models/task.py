import mongoengine as me

from sandglass_api.models.attachment import Attachment


class Task(me.Document):
    name = me.StringField(required=True)
    end_timestamp = me.DateTimeField(required=True)
    finished = me.BooleanField(default=False)
    url = me.URLField()
    attachment = me.EmbeddedDocumentListField(Attachment)
    start_timestamp = me.DateTimeField()
    description = me.StringField()

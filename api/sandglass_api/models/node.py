from datetime import datetime

import mongoengine as me

from sandglass_api.models.attachment import Attachment


class Node(me.EmbeddedDocument):
    """
    Represents a time node in the timeline.
    Originally meant to be used for courses.
    """
    meta = {'allow_inheritance': True}

    name = me.StringField(required=True)
    timestamp = me.DateTimeField(required=True)
    finished = me.BooleanField(default=False)
    start_timestamp = me.DateTimeField()  # if a node has a start timestamp, it represents a task
    attachment = me.EmbeddedDocumentListField(Attachment)
    description = me.StringField()
    url = me.URLField()

    def clean(self):
        super().clean()
        if type(self.timestamp) == str:
            self.timestamp = int(self.timestamp)
        if type(self.timestamp) == int:
            self.timestamp = datetime.fromtimestamp(self.timestamp / 1000)

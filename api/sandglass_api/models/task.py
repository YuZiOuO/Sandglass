from datetime import datetime

import mongoengine as me

from sandglass_api.models.attachment import Attachment


class Task(me.Document):
    """
    Represents a task that is part of a project.
    """
    name = me.StringField(required=True)
    end_timestamp = me.DateTimeField(required=True)
    finished = me.BooleanField(default=False)
    url = me.URLField()
    attachment = me.EmbeddedDocumentListField(Attachment)
    start_timestamp = me.DateTimeField()
    description = me.StringField()

    def clean(self):
        super().clean()
        if type(self.start_timestamp) == str:
            self.start_timestamp = int(self.start_timestamp)
        if type(self.end_timestamp) == str:
            self.end_timestamp = int(self.end_timestamp)

        if type(self.start_timestamp) == int:
            self.start_timestamp = datetime.fromtimestamp(self.start_timestamp / 1000)
        if type(self.end_timestamp) == int:
            self.end_timestamp = datetime.fromtimestamp(self.end_timestamp / 1000)

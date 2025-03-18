from datetime import datetime

import mongoengine as me

from sandglass_api.models.attachment import Attachment
from sandglass_api.models.node import Node
from sandglass_api.models.resource import Resource
from sandglass_api.models.task import Task


class Project(Resource):
    """
    Represents a project.
    """
    name = me.StringField(required=True)
    url = me.URLField()
    description = me.StringField()
    start_timestamp = me.DateTimeField()
    end_timestamp = me.DateTimeField()
    tasks = me.ListField(me.ReferenceField(Task))
    nodes = me.ListField(me.ReferenceField(Node))
    attachments = me.EmbeddedDocumentListField(Attachment)

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

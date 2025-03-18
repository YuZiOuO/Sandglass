import json
from datetime import datetime

import mongoengine as me

from sandglass_api.models.attachment import Attachment
from sandglass_api.models.node import Node
from sandglass_api.models.resource import Resource
from sandglass_api.models.task import Task


class Project(Resource):
    name = me.StringField(required=True)
    url = me.URLField()
    description = me.StringField()
    start_timestamp = me.DateTimeField()
    end_timestamp = me.DateTimeField()
    tasks = me.ListField(me.ReferenceField(Task))
    nodes = me.ListField(me.ReferenceField(Node))
    attachments = me.EmbeddedDocumentListField(Attachment)

    def to_json(self, *args, **kwargs):
        raw = json.loads(super().to_json())
        raw['id'] = str(super().id)
        raw['owner'] = str(self.owner.id)
        return json.dumps(raw)

    def clean(self):
        super().clean()
        if type(self.start_timestamp) == str:
            self.start_timestamp = datetime.fromtimestamp(self.start_timestamp)
        if type(self.end_timestamp) == str:
            self.end_timestamp = datetime.fromtimestamp(self.end_timestamp)

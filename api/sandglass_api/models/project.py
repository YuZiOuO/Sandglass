from datetime import datetime

import mongoengine as me
from flask_jwt_extended import current_user
from mongoengine import ReferenceField

from sandglass_api.models.attachment import Attachment
from sandglass_api.models.node import Node
from sandglass_api.models.user import User


class Project(me.Document):
    """
    Represents a project.
    """
    name = me.StringField(required=True)
    owner = me.ReferenceField(User, default=current_user)
    url = me.URLField()
    description = me.StringField()
    start_timestamp = me.DateTimeField()
    end_timestamp = me.DateTimeField()
    nodes = me.ListField(ReferenceField(Node))
    attachments = me.ListField(ReferenceField(Attachment))

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

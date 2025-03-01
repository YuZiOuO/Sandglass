from enum import Enum

import mongoengine as me

from sandglass_api.models.resource import Resource
from sandglass_api.models.task import Task


class ProjectStatus(str, Enum):
    NOT_STARTED = 'NOT_STARTED'
    IN_PROGRESS = 'IN_PROGRESS'
    COMPLETED = 'COMPLETED'
    ON_HOLD = 'ON_HOLD'


class Project(Resource):
    name = me.StringField(required=True)
    avatarUrl = me.URLField()
    description = me.StringField()
    start_timestamp = me.DateTimeField()
    end_timestamp = me.DateTimeField()
    status = me.EnumField(ProjectStatus)
    task = me.ListField(me.ReferenceField(Task))

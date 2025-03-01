import mongoengine as me

from sandglass_api.models.resource import Resource


class Task(Resource):
    name = me.StringField()
    end_timestamp = me.DateTimeField()
    status = me.StringField()  # TODO:more...
    description = me.StringField()
    parent_id = me.UUIDField()

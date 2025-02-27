import mongoengine as me

class Task(me.Document):
    name = me.StringField()
    end_timestamp = me.DateTimeField()
    status = me.StringField() # TODO:more...
    description = me.StringField()
    parent_id = me.UUIDField()

import mongoengine as me


class Node(me.Document):
    name = me.StringField(required=True)
    timestamp = me.DateTimeField(required=True)
    finished = me.BooleanField(default=False)
    description = me.StringField()
    url = me.URLField()

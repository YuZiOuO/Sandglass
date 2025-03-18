from datetime import datetime

import mongoengine as me


class Node(me.Document):
    name = me.StringField(required=True)
    timestamp = me.DateTimeField(required=True)
    finished = me.BooleanField(default=False)
    description = me.StringField()
    url = me.URLField()

    def clean(self):
        super().clean()
        if type(self.timestamp) == str:
            self.timestamp = int(self.timestamp)
        if type(self.timestamp) == int:
            self.timestamp = datetime.fromtimestamp(self.timestamp / 1000)

from datetime import datetime

import mongoengine as me


class User(me.Document):
    nickname = me.StringField()
    email = me.EmailField(required=True, unique=True)
    pwd = me.StringField(required=True)
    avatarUrl = me.URLField()
    pwd_salt = me.UUIDField(required=True)
    signup_timestamp = me.DateTimeField(default=datetime.now())

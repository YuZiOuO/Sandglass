from datetime import datetime

import mongoengine as me


class User(me.Document):
    email = me.EmailField(required=True, unique=True)
    pwd = me.StringField(required=True)
    pwd_salt = me.UUIDField(required=True)
    signup_timestamp = me.DateTimeField(default=datetime.now())
    administrator = me.BooleanField(required=True, default=True)

    nickname = me.StringField()
    avatar_url = me.URLField()

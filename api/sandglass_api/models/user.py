from datetime import datetime

import mongoengine as me


class User(me.Document):
    """
    Represents a user.
    """
    email = me.EmailField(required=True, unique=True)
    pwd = me.StringField(required=True)
    pwd_salt = me.UUIDField(required=True)  # Password salt,should not be provided by user
    signup_timestamp = me.DateTimeField(default=datetime.now())  # should not be provided by user
    administrator = me.BooleanField(required=True, default=True)

    nickname = me.StringField()
    avatar_url = me.URLField()

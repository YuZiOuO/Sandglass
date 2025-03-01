import mongoengine as me


class Resource(me.Document):
    meta = {'allow_inheritance': True}

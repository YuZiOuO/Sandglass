import mongoengine as me


class Attachment(me.Document):
    """
    Represents an attachment to either a project, task, or node.
    The filename passed to oss2 sdk will be str(self.id).
    """
    name = me.StringField(required=True)

import mongoengine as me


class Attachment(me.EmbeddedDocument):
    """
    Represents an attachment to either a project, task, or node.
    """
    name = me.StringField(required=True)
    url = me.URLField(required=True)

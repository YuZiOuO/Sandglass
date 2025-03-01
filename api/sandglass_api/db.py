import mongoengine as me

from sandglass_api.config import ALL_DOCUMENTED_TYPE


def connect_to(db_uri: str, db_name):
    return me.connect(db_name, host=db_uri)


# WARNING:THIS WILL DROP **ALL** COLLECTIONS
# DO NOT USE IN PRODUCTION ENV
def RESET_DATABASE():
    for t in ALL_DOCUMENTED_TYPE:
        t.drop_collection()

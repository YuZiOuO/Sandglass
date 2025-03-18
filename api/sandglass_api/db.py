import mongoengine as me

from sandglass_api.config import ALL_DOCUMENTED_TYPE


def connect_to(db_uri: str, db_name):
    me.connect(db_name, host=db_uri)

# WARNING:THIS WILL DROP **ALL** COLLECTIONS
# DO NOT USE IN PRODUCTION ENV
def RESET_DATABASE(config):
    if not config.get("TESTING"):
        raise Exception("RESET_DATABASE should only be used in testing environment")
    for t in ALL_DOCUMENTED_TYPE:
        t.drop_collection()

import unittest

from sandglass_api.models.user import User
from sandglass_api.util import parse_object_from_dict

class TestUtil(unittest.TestCase):
    def testParseObject(self):
        payload = {
            "nickname":"example_user",
            "email":"example@example.com",
            "pwd":"example_pwd@123456",

            "__slot__":"fields_should_not_be_accessible",
            "non_exist_field":"some_trash"
        }
        u = parse_object_from_dict(User, payload)
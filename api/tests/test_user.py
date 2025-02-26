import unittest

from tests.util import get_cli, is_valid_uuid4


class TestUserApi(unittest.TestCase):
    def test_signup(self):
        pwd_origin = ""
        payload = {
            "nickname":"example_user",
            "email":"example@example.com",
            "pwd":"example_pwd@123456",
        }
        response = get_cli().post('/user')
        self.assertEqual(response.status_code,"200")
        self.assertTrue(response.is_json)
        self.assertTrue(is_valid_uuid4(response.json['user_id']))

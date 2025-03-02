from werkzeug.datastructures import Authorization


class TestUserApi:
    def test_get_user_info(self, token, client):
        res = client.get('/user', auth=Authorization("bearer", token=token))
        print(res.data)

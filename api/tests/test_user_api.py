class TestUserApi:

    # 管理员获取所有用户
    def test_admin_get_all_user_info(self, client_auth):
        res = client_auth.get('/user')
        print(res.data)

    def test_get_user_info(self, client_auth):
        pass

    def test_change_user_info(self, client_auth):
        pass

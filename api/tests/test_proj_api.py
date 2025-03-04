class TestProjApi:
    def test_get_all_proj(self, client_auth):
        client_auth.get('/proj')

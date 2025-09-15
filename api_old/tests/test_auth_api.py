from starlette.testclient import TestClient


def build_login_request(client: TestClient):
    from api.tests.conftest import USER
    return client.build_request(
        "POST",
        '/token',
        data={
            "username": USER["email"],
            "password": USER["pwd"]
        },
        headers={
            "Content-Type": "application/x-www-form-urlencoded"
        }
    )


def build_logout_request(client: TestClient):
    return client.build_request(
        "DELETE",
        '/token'
    )

class TestAuthApi:
    def test_login(self, signup):
        req = build_login_request(signup)
        res = signup.send(req)
        assert res.status_code == 200

    def test_refresh_token(self, auth):
        # Get a new refresh token
        req = build_login_request(auth)
        res = auth.send(req)
        assert res.status_code == 200
        assert "refreshToken" in res.headers

        # Test refreshing token
        refresh_token = res.json()["refresh_token"]
        refresh_res = res.post('/token/refresh', json={"refresh_token": refresh_token})
        assert refresh_res.status_code == 200
        assert "access_token" in refresh_res.json()
        assert "token_type" in refresh_res.json()

        # Verify that the refresh token can not be used again
        repeat_res = res.post('/token/refresh', json={"refresh_token": refresh_token})
        assert repeat_res.status_code != 200

        # Verify that new access token is valid
        access_token = refresh_token.json()["access_token"]
        valid_res = auth.get('/user/me', headers={"Authorization": f"Bearer {access_token}"})
        assert valid_res.status_code == 200

    # def test_logout(self, client_auth):
    #     res = client_auth.delete('/token')
    #     set_cookie_items = str(res.headers)
    #     assert res.status_code == 200
    #     assert "Set-Cookie: access_token_cookie=;" in str(set_cookie_items)
    #     assert "Set-Cookie: csrf_access_token=;" in str(set_cookie_items)

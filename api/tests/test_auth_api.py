import re
from urllib.parse import urlencode

import jwt
import pytest
from flask.testing import EnvironBuilder
from werkzeug.datastructures import Authorization

import sandglass_api.config
from sandglass_api.config import JWT_EXPIRE_TIME, JWT_INVALIDATE_FRESHNESS_FACTOR, JWT_REFRESH_FACTOR
from tests.conftest import client
from tests.util import now


class TestAuthApi:
    @pytest.fixture(scope="session")
    def _signup(self, client):
        res = client.post("/user", json={
            "email": "test@example.com",
            "pwd": "test_pwd",
        })
        assert res.status == '202 ACCEPTED'

    @pytest.fixture(scope="session")
    def token(self, _signup, client) -> str:
        """
        login to the test account and offers a token.
        """
        params = urlencode({
            "email": "test@example.com",
            "pwd": "test_pwd",
        })
        res = client.get('/token?' + params)
        assert res.status == '200 OK'
        return res.json['access_token']

    @pytest.fixture(scope="session")
    def client_auth(self, app, token):
        """
        Offers a authorized client.
        """
        cli = app.test_client()
        builder = EnvironBuilder(app, auth=Authorization("Bearer", token=token))
        cli.environ_base = builder.get_environ()
        return cli

    def test_login(self, client_auth):
        assert client_auth.get('/').text == "Hello,world!"
        assert client_auth is not None

    def test_fresh_token(self, token):
        secret_key = sandglass_api.config.FlaskConfig.SECRET_KEY
        decoded_jwt = jwt.decode(token, secret_key, algorithms=['HS256'])
        fresh_until = decoded_jwt['fresh']
        assert now() < fresh_until
        assert now() + JWT_EXPIRE_TIME * JWT_INVALIDATE_FRESHNESS_FACTOR > fresh_until

    def test_invalidate_freshness(self, token):
        secret_key = sandglass_api.config.FlaskConfig.SECRET_KEY
        decoded_jwt = jwt.decode(token, secret_key, algorithms=['HS256'])
        valid_until = decoded_jwt['fresh']
        assert now() < valid_until
        assert now() + JWT_EXPIRE_TIME > valid_until

    def test_refresh_token(self, token, client):
        secret_key = sandglass_api.config.FlaskConfig.SECRET_KEY
        decoded_jwt = jwt.decode(token, secret_key, algorithms=['HS256'])
        decoded_jwt['exp'] = now() + (JWT_EXPIRE_TIME * (1 - JWT_REFRESH_FACTOR))
        res = client.get('/', auth=Authorization("Bearer", token=jwt.encode(decoded_jwt, secret_key)))
        set_cookie_items = res.headers.get_all('Set-Cookie')

        match_token = re.search(r"access_token_cookie=([^;]+)", str(set_cookie_items))
        match_csrf = re.search(r"csrf_access_token=([^;]+)", str(set_cookie_items))
        assert match_token
        assert match_csrf
        assert match_token.group(1) != token
        assert match_csrf.group(1) != decoded_jwt['csrf']

    def test_logout(self, client_auth):
        res = client_auth.delete('/token')
        set_cookie_items = str(res.headers)
        assert res.status_code == 200
        assert "Set-Cookie: access_token_cookie=;" in str(set_cookie_items)
        assert "Set-Cookie: csrf_access_token=;" in str(set_cookie_items)

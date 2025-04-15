import re

import jwt
from werkzeug.datastructures import Authorization

from sandglass_api.app import create_app
from tests.conftest import client
from tests.util import now

# Constants
current_app = create_app()
SECRET_KEY = current_app.config['SECRET_KEY']
JWT_EXPIRE_TIME = current_app.config['JWT_EXPIRE_TIME']
JWT_REFRESH_FACTOR = current_app.config['JWT_REFRESH_FACTOR']
JWT_INVALIDATE_FRESHNESS_FACTOR = current_app.config['JWT_INVALIDATE_FRESHNESS_FACTOR']

class TestAuthApi:
    def test_login(self, client_auth):
        assert client_auth.get('/').text == "Hello,world!"
        assert client_auth is not None

    def test_fresh_token(self, token):
        secret_key = SECRET_KEY
        decoded_jwt = jwt.decode(token, secret_key, algorithms=['HS256'])
        fresh_until = decoded_jwt['fresh']
        assert now() < fresh_until
        assert now() + JWT_EXPIRE_TIME * JWT_INVALIDATE_FRESHNESS_FACTOR > fresh_until

    def test_invalidate_freshness(self, token):
        secret_key = SECRET_KEY
        decoded_jwt = jwt.decode(token, secret_key, algorithms=['HS256'])
        valid_until = decoded_jwt['fresh']
        assert now() < valid_until
        assert now() + JWT_EXPIRE_TIME > valid_until

    def test_refresh_token(self, token, client):
        secret_key = SECRET_KEY
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

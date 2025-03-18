from urllib.parse import urlencode

import pytest
from flask.testing import EnvironBuilder
from werkzeug.datastructures import Authorization

from sandglass_api.app import create_app
from sandglass_api.db import RESET_DATABASE
from tests.config import TEST_DB_URI, TEST_DB_DATABASE_NAME


# 每次测试前，清空数据库。
@pytest.fixture(scope="session")
def app():
    app = create_app(TEST_DB_URI, TEST_DB_DATABASE_NAME)
    app.config.update({
        "TESTING": True,
    })

    RESET_DATABASE(app.config)  # Reset before test
    yield app
    RESET_DATABASE(app.config)  # Reset after tests


@pytest.fixture(scope="session")
def client(app):
    return app.test_client()


@pytest.fixture(scope="session")
def runner(app):
    return app.test_cli_runner()


@pytest.fixture(scope="session")
def _signup(client):
    res = client.post("/user", json={
        "email": "test@example.com",
        "pwd": "test_pwd",
    })
    assert res.status == '200 OK'


@pytest.fixture(scope="session")
def token(_signup, client) -> str:
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
def client_auth(app, token):
    """
    Offers a authorized client.
    """
    cli = app.test_client()
    builder = EnvironBuilder(app, auth=Authorization("Bearer", token=token))
    cli.environ_base = builder.get_environ()
    return cli
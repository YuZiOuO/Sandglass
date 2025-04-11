from random import randint
from urllib.parse import urlencode

import pytest
from flask.testing import EnvironBuilder
from werkzeug.datastructures import Authorization

from sandglass_api.app import create_app
from sandglass_api.middleware.db_module import RESET_DATABASE
from tests.config import TEST_DB_URI, TEST_DB_DATABASE_NAME
from tests.util import random_timestamp_ms


@pytest.fixture()
def app():
    app = create_app(TEST_DB_URI, TEST_DB_DATABASE_NAME)
    app.config.update({
        "TESTING": True,
    })

    RESET_DATABASE(app.config)  # Reset before test
    yield app
    RESET_DATABASE(app.config)  # Reset after tests


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def runner(app):
    return app.test_cli_runner()


@pytest.fixture()
def _signup(client):
    # No Teardown here because the database will be reset after the test.
    res = client.post("/user", json={
        "email": "test@example.com",
        "pwd": "test_pwd",
    })
    assert res.status == '202 ACCEPTED'


@pytest.fixture()
def token(_signup, client) -> str:
    """
    login to the test account and offers a token.
    """
    # No Teardown here because the token can not be revoked.
    params = urlencode({
        "email": "test@example.com",
        "pwd": "test_pwd",
    })
    res = client.get('/token?' + params)
    assert res.status == '200 OK'
    return res.json['access_token']


@pytest.fixture()
def client_auth(app, token):
    """
    Offers a authorized client.
    """
    # No Teardown here because the token can not be revoked.
    cli = app.test_client()
    builder = EnvironBuilder(app, auth=Authorization("Bearer", token=token))
    cli.environ_base = builder.get_environ()
    return cli

@pytest.fixture()
def proj(client_auth):
    """
    Create a project with no nodes, or attachments.
    """
    create_res = client_auth.post('/proj', json={
        "name": "Test Project",
        "url": "https://example.com",
        "description": "This is a test project.",
        "start_timestamp": random_timestamp_ms(),
        "end_timestamp": random_timestamp_ms(),
        "nodes": [],
        "attachments": []
    })
    assert str(create_res.status) == "201 CREATED"

    yield create_res.text

    deleted_res = client_auth.delete("/proj/" + create_res.text)
    assert deleted_res.status == "204 NO CONTENT"

@pytest.fixture()
def node(proj, client_auth):
    """
    Create a fixture containing a proj with random nodes.
    :return: a tuple of (proj_id,node_id:List)
    """
    # Randomly create nodes
    nodes = []
    for i in range(randint(5, 10)):
        res = client_auth.post(f'/proj/{proj}/node', json={
            'name': f'test_node_{i}',
            'timestamp': random_timestamp_ms(),
        })
        assert res.status == "201 CREATED"
        nodes.append(res.text)

    yield proj, nodes

    # Teardown,delete all nodes created
    delete_result = list(map(lambda n: client_auth.delete('/node/' + n).status, nodes))
    for r in delete_result:
        assert r == '204 NO CONTENT'

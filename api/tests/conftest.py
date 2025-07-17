from random import randint

import pytest
from beanie import init_beanie
from fastapi.testclient import TestClient
from mongomock_motor import AsyncMongoMockClient

import db
import module
from main import app
from .util import random_timestamp_ms, OAuthScheme


@pytest.fixture()
def client(monkeypatch):
    async def mock_init_db():
        mock_cli = AsyncMongoMockClient()
        await init_beanie(mock_cli.get_default_database(), module.document_types)

    monkeypatch.setattr(db, 'init_db', mock_init_db)
    client = TestClient(app=app)
    return client

@pytest.fixture()
def _signup(client):
    # No Teardown here because the database will be reset after the test.
    res = client.post("/user", json={
        "email": "test@example.com",
        "pwd": "test_pwd",
    })
    assert res.status_code == 202

@pytest.fixture()
def auth(_signup):
    auth_scheme = OAuthScheme('test@example.com', 'test_pwd', '/token', '/token')
    return auth_scheme

@pytest.fixture()
def proj(client, auth):
    """
    Create a project with no nodes, or attachments.
    """
    create_res = client.post('/proj', data={
        "name": "Test Project",
        "url": "https://example.com",
        "description": "This is a test project.",
        "start_timestamp": random_timestamp_ms(),
        "end_timestamp": random_timestamp_ms(),
        "nodes": [],
        "attachments": []
    }, auth=auth)
    assert create_res.status_code == 201

    yield create_res.text

    deleted_res = client.delete("/proj/" + create_res.text)
    assert deleted_res.status_code == 204

@pytest.fixture()
def node(proj, client, auth):
    """
    Create a fixture containing a proj with random nodes.
    :return: a tuple of (proj_id,node_id:List)
    """
    # Randomly create nodes
    nodes = []
    for i in range(randint(5, 10)):
        res = client.post(f'/proj/{proj}/node', data={
            'name': f'test_node_{i}',
            'timestamp': random_timestamp_ms(),
        }, auth=auth)
        assert res.status_code == 201
        nodes.append(res.text)

    yield proj, nodes

    # Teardown,delete all nodes created
    delete_result = list(map(lambda n: client.delete('/node/' + n).status_code, nodes))
    for r in delete_result:
        assert r == 204

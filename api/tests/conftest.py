from random import randint

import pytest
from beanie import init_beanie
from fastapi.testclient import TestClient
from mongomock_motor import AsyncMongoMockClient

import db
import model
from main import app
from .test_auth_api import build_login_request, build_logout_request
from .util import random_timestamp_ms

USER = {
    "email":            "user@example.com",
    "signup_timestamp": "2025-07-18T09:39:10.871Z",
    "administrator":    True,
    "nickname":         "string",
    "avatar_url":       "https://example.com/",
    "pwd":              "string"
}
DB_NAME = "test_db"

@pytest.fixture()
def client(monkeypatch):
    async def mock_init_db():
        mock_cli = AsyncMongoMockClient()
        await init_beanie(mock_cli.get_database(DB_NAME), document_models=model.document_types)

    monkeypatch.setattr(db, 'init_db', mock_init_db)

    with TestClient(app) as test_client:
        # this will trigger the startup of app, initializing the database
        yield test_client

@pytest.fixture()
def signup(client):
    user = USER
    res = client.post("/user", json=user)
    assert res.status_code == 200
    return client


@pytest.fixture()
def auth(signup):
    req = build_login_request(signup)
    res = signup.send(req)
    assert res.status_code == 200
    json = res.json()
    assert "access_token" in json
    assert "token_type" in json

    yield signup

    req = build_logout_request(signup)
    res = signup.send(req)
    assert res.status_code == 200


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

from datetime import datetime

import pytest
from flask.testing import FlaskClient

from sandglass_api.models.project import Project


class TestProjApi:
    def test_get_all_proj(self, client_auth: FlaskClient):
        client_auth.get('/proj')

    @pytest.fixture
    def test_create_proj(self, client_auth: FlaskClient):
        res = client_auth.post('/proj', json={
            'name': 'test_proj',
            'avatarUrl': '',
            'description': 'test_description',
            'start_timestamp': str(datetime.now().timestamp()),
            'end_timestamp': str(datetime.now().timestamp()),
            'status': 'NOT_STARTED',
            'task': '',
        })

        assert str(res.status) == "200 OK"
        return res.text

    def test_get_proj_by_id(self, client_auth: FlaskClient, test_create_proj):
        res = client_auth.get(f'/proj/{test_create_proj}')
        assert str(res.status) == "200 OK"
        assert Project.from_json(res.text)

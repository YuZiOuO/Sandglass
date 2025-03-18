import pytest
from flask.testing import FlaskClient

from sandglass_api.models.project import Project


class TestProjApi:
    @pytest.fixture()
    def test_create_proj(self, client_auth: FlaskClient):
        res = client_auth.post('/proj', json={
            'name': 'test_proj',
        })

        assert str(res.status) == "200 OK"
        return res.text

    def test_create_proj_with_invalid_data(self, client_auth: FlaskClient):
        res = client_auth.post('/proj', json={
            'name': 'test_proj',
            'non_existing_field': 'test'
        })

        assert str(res.status) == '400 BAD REQUEST'
        assert res.text == ('Invalid field name.'
                            + 'The fields "{\'non_existing_field\'}" do not exist on the document "Resource.Project"')

    @pytest.fixture()
    def test_get_proj_by_id(self, client_auth: FlaskClient, test_create_proj):
        res = client_auth.get(f'/proj/{test_create_proj}')
        assert str(res.status) == "200 OK"
        assert Project.from_json(res.text)

    def test_get_proj_by_id_with_non_existing_id(self, client_auth: FlaskClient, test_create_proj):
        res = client_auth.get(f'/proj/{test_create_proj[:-3] + "abc"}')
        assert str(res.status) == "404 NOT FOUND"
        assert res.text == 'Project with given id not found.'

    def test_get_proj_by_current_user(self, test_create_proj, client_auth: FlaskClient):
        res = client_auth.get('/proj').text

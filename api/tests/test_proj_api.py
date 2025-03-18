import json

import pytest

from sandglass_api.models.project import Project


class TestProjApi:
    @pytest.fixture(scope="session")
    def empty_proj(self, client_auth):
        res = client_auth.post('/proj', json={
            'name': 'test_proj',
        })

        assert str(res.status) == "200 OK"
        return res.text

    @pytest.fixture(scope="session")
    def proj(self, client_auth):
        res = client_auth.post('/proj', json={
            "name": "Test Project",
            "url": "https://example.com",
            "description": "This is a test project.",
            "start_timestamp": 1742294400000,
            "end_timestamp": 1750279200000,
            "tasks": [],
            "nodes": [],
            "attachments": []
        })

        assert str(res.status) == "200 OK"
        return res.text

    @pytest.fixture(scope="session")
    def proj_with_tasks_and_nodes(self, client_auth):
        # 测试创建含有嵌套task的proj
        # 这个fixture写完后，命名为proj，和上面那个fixture互换
        pass  # TODO

    def test_create_proj(self, proj):
        assert proj

    def test_create_proj_with_tasks_and_nodes(self, proj_with_tasks_and_nodes):
        print("# TODO")

    def test_create_proj_empty(self, empty_proj):
        assert empty_proj

    def test_create_proj_non_existing_field(self, client_auth):
        res = client_auth.post('/proj', json={
            'name': 'test_proj',
            'non_existing_field': 'test'
        })

        assert str(res.status) == '400 BAD REQUEST'
        assert res.text == ('Invalid field name.'
                            + 'The fields "{\'non_existing_field\'}" do not exist on the document "Resource.Project"')

    def test_get_proj_by_id(self, client_auth, proj):
        res = client_auth.get(f'/proj/{proj}')
        assert str(res.status) == "200 OK"
        assert Project.from_json(res.text)

    def test_get_proj_with_non_existing_id(self, client_auth, proj):
        res = client_auth.get(f'/proj/{proj[:-3] + "abc"}')
        assert str(res.status) == "404 NOT FOUND"
        assert res.text == 'Project with given id not found.'

    def test_get_proj_by_user(self, proj, client_auth):
        res = client_auth.get('/proj')
        all_proj = json.loads(res.text)
        assert all_proj

        for proj in all_proj:
            assert Project.from_json(json.dumps(proj))

    def test_get_proj_by_user_select_related(self, proj, client_auth):
        res = client_auth.get('/proj?select_related=True')

        all_proj = json.loads(res.text)
        assert all_proj

        for proj in all_proj:
            assert Project.from_json(json.dumps(proj))

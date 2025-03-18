import json

from sandglass_api.models.project import Project


class TestProjApi:
    def test_create_proj_empty(self, proj_empty):
        assert proj_empty  # Tested by fixture

    def test_create_proj_with_no_reference(self, proj_no_reference):
        assert proj_no_reference  #Tested by fixture

    # TODO:implement this test
    # def test_create_proj(self, proj):
    #     assert proj

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

    def test_get_proj_with_non_existing_id(self, proj, client_auth):
        res = client_auth.get(f'/proj/{proj[:-3] + "abc"}')
        assert str(res.status) == "404 NOT FOUND"
        assert res.text == 'Project with given id not found.'

    def test_get_proj_with_invalid_id(self, client_auth):
        res = client_auth.get('/proj/abc')
        assert str(res.status) == "400 BAD REQUEST"
        assert res.text == 'Invalid id format.'

    def test_get_proj_by_user(self, proj_no_reference, client_auth):
        res = client_auth.get('/proj')
        all_proj = json.loads(res.text)
        assert len(all_proj) == 1

    def test_get_proj_by_user_select_related(self, proj_no_reference, client_auth):
        res = client_auth.get('/proj?select_related=True')

        all_proj = json.loads(res.text)
        assert len(all_proj) == 1

        for proj in all_proj:
            assert Project.from_json(json.dumps(proj))

    def test_delete_proj(self):
        pass  # Tested by fixture

    def test_delete_proj_with_non_existing_id(self, proj, client_auth):
        res = client_auth.delete(f'/proj/{proj[:-3] + "abc"}')
        assert str(res.status) == "404 NOT FOUND"
        assert res.text == 'Project with given id not found.'

    def test_delete_proj_with_invalid_id(self, client_auth):
        res = client_auth.delete('/proj/abc')
        assert str(res.status) == "400 BAD REQUEST"
        assert res.text == 'Invalid id format.'

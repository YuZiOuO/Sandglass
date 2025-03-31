import json
from random import randint

from sandglass_api.models.node import Node


class TestNodeApi:
    def test_get_node_by_id(self, client_auth, node):
        res = client_auth.get(f'/node/{node}')
        assert str(res.status) == "200 OK"
        assert Node.from_json(res.text)

    def test_get_node_with_non_existing_id(self, node, client_auth):
        res = client_auth.get(f'/node/{node[:-3] + "abc"}')
        assert str(res.status) == "404 NOT FOUND"
        assert res.text == 'Node with given id not found.'

    def test_get_node_with_invalid_id(self, client_auth):
        res = client_auth.get('/node/abc')
        assert str(res.status) == "400 BAD REQUEST"
        assert res.text == 'Invalid node id format.'

    def test_get_nodes_by_proj(self, client_auth, proj_no_reference):
        # Randomly create nodes in empty proj
        id_arr = []
        for i in range(randint(5, 10)):
            res = client_auth.post(f'/proj/{proj_no_reference}/node', json={
                'name': f'test_node_{i}',
                'timestamp': 1742294400000,
            })
            assert res.status == "201 CREATED"
            id_arr.append(res.text)

        res = client_auth.get(f'/proj/{proj_no_reference}/node')
        assert str(res.status) == "200 OK"

        # TODO
        nodes = json.loads(res.text)
        print(res.text)

    def test_get_nodes_by_proj_with_non_existing_id(self, client_auth):
        res = client_auth.get('/proj/abc/node')
        assert str(res.status) == "404 NOT FOUND"
        assert res.text == 'Project with given id not found.'

    def test_create_task_by_proj(self, client_auth, proj):
        res = client_auth.post(f'/proj/{proj}/node', json={
            'name': 'test_node',
            'timestamp': 1742294400000,
        })
        assert str(res.status) == "200 OK"
        assert Node.objects.with_id(res.text)

    def test_create_task_by_proj_with_non_existing_id(self, client_auth):
        res = client_auth.post('/proj/abc/node', json={
            'name': 'test_node',
            'description': 'test description'
        })
        assert str(res.status) == "404 NOT FOUND"
        assert res.text == 'Project with given id not found.'

    def test_create_task_by_proj_with_invalid_field(self, client_auth, proj):
        res = client_auth.post(f'/proj/{proj}/node', json={
            'name': 'test_node',
            'invalid_field': 'test'
        })
        assert str(res.status) == "400 BAD REQUEST"
        assert 'Invalid field name' in res.text

    def test_get_unfinished_nodes_by_current_user(self, client_auth):
        res = client_auth.get('/node')
        assert str(res.status) == "200 OK"
        nodes = json.loads(res.text)
        assert isinstance(nodes, list)

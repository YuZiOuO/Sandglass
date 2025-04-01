import json

from sandglass_api.models.node import Node


class TestNodeApi:
    def test_get_node_by_id(self, client_auth, node: tuple):
        proj, nodes = node  # unpack tuple
        res = client_auth.get(f'/node/{nodes[0]}')
        assert str(res.status) == "200 OK"
        assert Node.from_json(res.text)

    def test_get_node_with_non_existing_id(self, node, client_auth):
        proj, nodes = node  # unpack tuple
        res = client_auth.get(f'/node/{nodes[0][:-3] + "abc"}')
        assert str(res.status) == "404 NOT FOUND"

    def test_get_node_with_invalid_id(self, client_auth):
        res = client_auth.get('/node/abc')
        assert str(res.status) == "400 BAD REQUEST"
        assert res.text == '\'abc\' is not a valid ObjectId, it must be a 12-byte input or a 24-character hex string'

    def test_get_nodes_by_proj(self, client_auth, node):
        proj, nodes = node
        res = client_auth.get(f'/proj/{proj}/node')
        nodes_got = json.loads(res.text)
        assert len(nodes_got) == len(nodes)

    def test_create_node(self, client_auth, proj):
        # Tested by fixture
        pass

    def test_create_node_by_proj_with_invalid_field(self, client_auth, proj):
        res = client_auth.post(f'/proj/{proj}/node', json={
            'name': 'test_node',
            'invalid_field': 'test'
        })
        assert str(res.status) == "400 BAD REQUEST"
        assert res.text == "The fields \"{'invalid_field'}\" do not exist on the document \"Node\""

    # pending:against api invariant
    # def test_get_unfinished_nodes_by_current_user(self, client_auth):
    #     res = client_auth.get('/node')
    #     assert str(res.status) == "200 OK"
    #     nodes = json.loads(res.text)
    #     assert isinstance(nodes, list)

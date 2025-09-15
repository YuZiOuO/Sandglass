class TestApp:
    def test_app_initialized(self, client):
        assert client.get('/health').text == "OK"

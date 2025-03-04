from flask import Flask

class TestApp:
    def test_init_app(self, app):
        assert isinstance(app, Flask)

    def test_init_client(self, client_auth):
        assert client_auth.get('/').text == "Hello,world!"

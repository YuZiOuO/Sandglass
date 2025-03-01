from flask import Flask


class TestApp:
    def test_init_app(self, app):
        assert type(app) == Flask

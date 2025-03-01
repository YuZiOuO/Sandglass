import pytest
from flask import Flask

from sandglass_api.app import create_app
from sandglass_api.db import RESET_DATABASE
from tests.config import TEST_DB_URI, TEST_DB_DATABASE_NAME


# 每个测试函数执行前，都会清空数据库。

@pytest.fixture()
def app():
    app = create_app(TEST_DB_URI, TEST_DB_DATABASE_NAME)
    app.config.update({
        "TESTING": True,
    })

    RESET_DATABASE()  # Reset before test
    yield app
    RESET_DATABASE()  # Reset after tests


@pytest.fixture()
def client(app: Flask):
    return app.test_client()


@pytest.fixture()
def runner(app: Flask):
    return app.test_cli_runner()

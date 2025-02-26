import re

from sandglass_api.app import app

uuid4_regex = re.compile(r'^[a-f0-9]{8}'+
                         r'-[a-f0-9]{4}'+
                         r'-4[a-f0-9]{3}'+
                         r'-[89ab][a-f0-9]{3}'+
                         r'-[a-f0-9]{12}$')

def is_valid_uuid4(string:str) -> bool:
    return uuid4_regex.match(string) is not None

def get_cli():
    # TODO:测试数据库判断逻辑
    # TODO:测试数据库清理逻辑
    return app.test_client()
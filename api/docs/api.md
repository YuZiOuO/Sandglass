# API规范
使用RESTful API，传递请求时统一使用json

## 资源

# 数据库

使用mongo-engine作为数据库驱动

# 密码传递方案
前端SSL传明文，后端加盐传数据库核对

# Abstraction

## Account 账户
包括一个用户User和该用户的所有登录会话Session,以及该用户的所有操作记录log

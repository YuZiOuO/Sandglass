# 命名规范

## 字段名
统一使用小驼峰

## 类名
统一使用大驼峰

# 资源
Project和Task等可以访问的对象抽象为资源，继承Resource基类.

## 资源权限控制
采用ACL机制,每个资源都有基类方法`get_ACE`(getAccessContorlEntry)获得一个

# 关于`StringField(choice=)`和`EnumField`
尽量使用Enum,因为可以被IDE识别,方便维护

# 关于数据库查询的first:
调用first时,确保查询的字段`unique=True`

# 关于测试

单个API作为最小测试单元。
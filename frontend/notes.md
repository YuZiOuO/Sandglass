# n-card

没有style限制时，card默认填满整个父级容器

可以通过max-width修改，但可能会导致子元素超出

# 关于SFC的script

一般只需写import和export

如果某个数据或函数不属于组件实例，而是整个文件共享，可以放在 export default 外面。
如果某个方法是纯函数（不依赖 Vue 组件实例），可以放在 export default 外

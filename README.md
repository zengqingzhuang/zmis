# finbox

### 说明

 本项目基于vue2.x + vuex2.x + ElementUI等框架开发,所涉及的组件、渲染器、vue相关特性开发一般情况下都是在此范围内。


### 目录结构

- component：  finbox 扩展组件
- renderer：  finbox配置化渲染器
- src：  通用API,vue相关特性扩展
- schema\json-schema：配置文件json格式标准描述文件


### 引用方式

在项目中引入finbox


- 1. 通过git submodule 命令引入


## submodule操作

- 下载子模块: git submodule update --init --recursive
- 更新子模块: git submodule foreach git pull  origin master
     - 方法二(适应单个子模块): cd components/finbox && git pull origin master
- 提交子模块: cd components/finbox && git add . && git commit-m ' ' && git push origin HEAD:refs/for/master




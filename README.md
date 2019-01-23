### Gitter
本仓库是Gitter小程序对应的开源仓库，旨在分享微信小程序的开发经验。
初入前端，还望各位大佬多多指教。

该项目采用 [Taro](https://taro.aotu.io/) 框架 + [Taro UI](https://taro-ui.aotu.io) 进行开发，小程序内数据均来自于 [GitHub Api v3](https://developer.github.com/v3/)


感谢相关作者的努力及开源精神。

### 说明

- 由于小程序的限制，无法使用OAuth跳转认证，故采用Token+Account认证方式；
- 推荐使用Token认证方式，Token及用户名密码仅用于GitHub Api权限校验，不会被上传服务器；
- Token的生成方式请移步[New personal access token](https://github.com/settings/tokens/new)，按照步骤即可生成Token；
- 由于目前个人能力有限，目前在小程序内关于Markdown的解析并不完美，欢迎有兴趣的大佬PR；
- 此源码仅供交流学习，**严禁**以任何形式独立发布或用于商业用途；

### 使用

``` 
git clone git@github.com:huangjianke/Gitter.git
cd Gitter
```
使用方法请参考：
[Taro 安装及使用](https://nervjs.github.io/taro/docs/GETTING-STARTED.html)

### 扫码体验

扫码访问小程序:

![Gitter](https://raw.githubusercontent.com/huangjianke/Gitter/master/images/code.png)

## 部分页面展示
|Trending|Activity|
| :---: | :---: |
|![摘录](https://raw.githubusercontent.com/huangjianke/Gitter/master/images/img00.png) | ![详情](https://raw.githubusercontent.com/huangjianke/Gitter/master/images/img01.png)|
|User|Repo|
|![文库](https://raw.githubusercontent.com/huangjianke/Gitter/master/images/img02.png) | ![作者](https://raw.githubusercontent.com/huangjianke/Gitter/master/images/img03.png)|

### Todo

- [ ] 完善Markdown解析
- [ ] 完善Issue相关功能
- [ ] ...

微信讨论群：
(待续...)

### LICENSE


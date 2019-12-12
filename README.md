### Gitter
本仓库是`Gitter`小程序对应的开源仓库，旨在分享微信小程序的开发经验。
初入前端，还望各位大佬多多指教。

该项目采用 [Taro](https://taro.aotu.io/) 框架 + [Taro UI](https://taro-ui.aotu.io) 进行开发，小程序内数据均来自于 [GitHub Api v3](https://developer.github.com/v3/)


感谢相关作者的努力及开源精神。

文章介绍：

[Gitter - 高颜值GitHub小程序客户端诞生记](https://juejin.im/post/5c4c738ce51d4525211c129b)

### 说明

- 由于个人类型的小程序无法使用`web-view`组件的限制，无法使用`OAuth`跳转认证，故采用`Token` + `Account`认证方式，另外也暂不支持内部超链接跳转；
- 推荐使用`Token`认证方式，`Token`及用户名密码仅用于 `GitHub Api` 权限校验，不会被上传服务器；
- Token的生成方式请移步[New personal access token](https://github.com/settings/tokens/new)，按照步骤即可生成Token(**特别提醒：为了最完整的功能体验，生成`Token`的时候请确保勾选全部权限**)；
- ~~由于目前个人能力有限，目前在小程序内关于Markdown的解析并不完美，欢迎有兴趣的大佬PR；~~(采用[Towxml](https://github.com/sbfkcel/towxml)提供的方案，基本上已经完美解析，感谢开源作者)
- **此源码仅供交流学习，严禁以任何形式独立发布或用于商业用途；**

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

- [x] 完善 `Markdown` 解析
- [x] 完善 `Trending` 列表筛选功能
- [x] 完善 `Search` 相关功能
- [ ] 完善 `Issue` 相关功能
- [ ] ...

## 更新记录

- v1.3.1

  1、新增 分享仓库海报 功能
 
- v1.3.0

  1、优化刷新逻辑
  
  2、新增反馈入口
  
- v1.2.0

  1、优化 `Trending` 列表筛选功能
  
  2、优化 `Search` 相关功能
  
- v1.0.0

  `Gitter` 诞生了


有疑问或建议可提`issue`，我会尽快处理。

微信讨论群：
由于人数已满，有需要的可以扫码添加微信(请注明：GitHub)：


![Gitter](https://raw.githubusercontent.com/huangjianke/Gitter/master/images/WeChat.png)


### LICENSE

[Apache License 2.0](./LICENSE)


### 其他小程序

|层叠拼图Plus - 烧脑益智小游戏|诗词墨客 - 最全中华古诗词小程序|
| :---: | :---: |
|![层叠拼图](https://raw.githubusercontent.com/huangjianke/Gitter/master/images/stack.png)|![诗词墨客](https://raw.githubusercontent.com/huangjianke/weapp-poem/master/images/code.png)|

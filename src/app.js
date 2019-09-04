import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import { get as getGlobalData, set as setGlobalData } from './utils/global_data'

import Index from './pages/index'

import configStore from './store'

import './app.less'
import './assets/ionicons/css/ionicons.min.css'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore

class App extends Component {

  config = {
    pages: [
      'pages/index/index',
      'pages/index/favoriteLanguages',
      'pages/account/index',
      'pages/git/git',
      'pages/git/tutorials',
      'pages/activity/index',
      'pages/search/index',
      'pages/search/searchResult',
      'pages/account/follow',
      'pages/account/about',
      'pages/account/developerInfo',
      'pages/repo/contentList',
      'pages/repo/issues',
      'pages/repo/issueDetail',
      'pages/repo/addIssue',
      'pages/repo/addComment',
      'pages/repo/repoList',
      'pages/repo/repo',
      'pages/repo/contributors',
      'pages/repo/starredRepo',
      'pages/repo/file',
      'pages/repo/repoEvents',
      'pages/login/login'
    ],
    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'Gitter',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      list: [{
        pagePath: 'pages/index/index',
        text: 'Trending',
        iconPath: './assets/images/tab_trend.png',
        selectedIconPath: './assets/images/tab_trend_s.png'
      }, {
        pagePath: 'pages/activity/index',
        text: 'Activity',
        iconPath: './assets/images/tab_news.png',
        selectedIconPath: './assets/images/tab_news_s.png'
      }, 
      // {
      //   pagePath: 'pages/git/git',
      //   text: 'Git',
      //   iconPath: './assets/images/tab_git.png',
      //   selectedIconPath: './assets/images/tab_git_s.png'
      // }, 
      {
        pagePath: 'pages/account/index',
        text: 'Me',
        iconPath: './assets/images/tab_me.png',
        selectedIconPath: './assets/images/tab_me_s.png'
      }],
      color: '#8a8a8a',
      selectedColor: '#2d8cf0',
      backgroundColor: '#ffffff',
      borderStyle: 'white'
    },
    navigateToMiniProgramAppIdList: [
      'wx8abaf00ee8c3202e'
    ]
  }

  componentDidMount() {
    this.updateApp()
    wx.cloud.init({
      env: 'gitter-prod-pkqn3',
      traceUser: true
    })
    this.loadOpenId()
    this.loadConfig()
  }

  componentDidShow() { }

  componentDidHide() { }

  componentCatchError() { }

  componentDidCatchError() { }

  loadOpenId() {
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'openid',
    }).then(res => {
      const openid = res.result.openid
      setGlobalData('openid', openid || null)
      if (openid) {
        Taro.setStorageSync('openid', openid)
      }
    }).catch(err => {
      console.log('openid err', err)
    })
  }

  loadConfig() {
    let that = this
    const db = wx.cloud.database()
    db.collection('config')
      .where({})
      .get()
      .then(res => {
        console.log(res)
        if (res.data.length > 0) {
          Taro.setStorage({
            key: 'config_gitter',
            data: res.data[0]
          })
        }
      })
      .catch(err => {
        console.error(err)
      })
  }

  /*更新小程序*/
  updateApp() {
    if (Taro.canIUse('getUpdateManager')) {
      const updateManager = Taro.getUpdateManager()
      updateManager.onCheckForUpdate((res) => {
        // 请求完新版本信息的回调
        console.log('hasUpdate', res.hasUpdate)
      })
      updateManager.onUpdateReady(() => {
        Taro.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success(res) {
            if (res.confirm) {
              updateManager.applyUpdate()
            }
          }
        })
      })
      updateManager.onUpdateFailed(() => {
        // 新版本下载失败
      })
    }
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))

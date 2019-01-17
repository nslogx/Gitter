import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'

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
      'pages/search/index',
      'pages/account/index',
      'pages/account/repoList',
      'pages/account/repo',
      'pages/account/follow',
      'pages/account/starredRepo',
      'pages/account/login',
      'pages/account/issueList',
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
        iconPath: './assets/images/tab_extract.png',
        selectedIconPath: './assets/images/tab_extract_s.png'
      }, {
        pagePath: 'pages/search/index',
        text: 'Search',
        iconPath: './assets/images/tab_library.png',
        selectedIconPath: './assets/images/tab_library_s.png'
      }, {
        pagePath: 'pages/account/index',
        text: 'Me',
        iconPath: './assets/images/tab_author.png',
        selectedIconPath: './assets/images/tab_author_s.png'
      }],
      color: '#8a8a8a',
      selectedColor: '#2d8cf0',
      backgroundColor: '#ffffff',
      borderStyle: 'white'
    }
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentCatchError () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))

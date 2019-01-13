import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'

import Index from './pages/index'

import configStore from './store'

import './app.less'

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
      'pages/account/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      list: [{
        pagePath: 'pages/index/index',
        text: 'Trending',
        iconPath: './assets/tab_extract.png',
        selectedIconPath: './assets/tab_extract_s.png'
      }, {
        pagePath: 'pages/search/index',
        text: 'Search',
        iconPath: './assets/tab_library.png',
        selectedIconPath: './assets/tab_library_s.png'
      }, {
        pagePath: 'pages/account/index',
        text: 'Me',
        iconPath: './assets/tab_author.png',
        selectedIconPath: './assets/tab_author_s.png'
      }],
      color: '#8a8a8a',
      selectedColor: '#2d8cf0',
      backgroundColor: '#ffffff',
      borderStyle: 'black'
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

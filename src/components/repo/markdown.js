import Taro, { Component } from '@tarojs/taro'
import PropTypes from 'prop-types'
import { View, Text } from '@tarojs/components'
import { AtActivityIndicator } from 'taro-ui'

import './markdown.less'

import Towxml from '../towxml/main'

const render = new Towxml()

export default class Markdown extends Component {
  static propTypes = {
    md: PropTypes.string,
    base: PropTypes.string,
    cache: PropTypes.bool,
    cacheKey: PropTypes.string
  }

  static defaultProps = {
    md: null,
    base: null,
    cache: false,
    cacheKey: null
  }

  constructor(props) {
    super(props)
    this.state = {
      data: null,
      fail: false
    }
  }

  componentDidMount() {
    const { cache, cacheKey } = this.props
    if (cache) {
      let that = this
      Taro.getStorage({
        key: cacheKey,
        complete(res) {
          console.log('markdown complete', res)
          if (res.data) {
            that.setState({
              fail: false,
              data: res.data
            })
          } else {
            that.parseReadme()
          }
        }
      })
    } else {
      this.parseReadme()
    }
  }

  parseReadme() {
    const { md, base, cache, cacheKey } = this.props
    let that = this
    that.setState({
      fail: false
    })
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'parse',
      // 传递给云函数的event参数
      data: {
        func: 'parse',
        type: 'markdown',
        content: md,
      }
    }).then(res => {
      let data = res.result.data
      if (base && base.length > 0) {
        data = render.initData(data, {base: base, app: this.$scope})
      }
      that.setState({
        fail: false,
        data: data
      })
      if (cache) {
        Taro.setStorage({
          key: cacheKey,
          data: data
        })
      }
    }).catch(err => {
      console.log('cloud', err)
      that.setState({
        fail: true
      })
    })
  }

  onTap (e) {
    if (e.currentTarget.dataset._el.tag === 'image') {
      Taro.previewImage({
        urls: [e.currentTarget.dataset._el.attr.src]
      })
    }
  }

  render() {
    const { data, fail } = this.state
    if (fail) {
      return (
        <View className='fail' onClick={this.parseReadme.bind(this)}>
          <Text className='text'>load failed, try it again?</Text>
        </View>
      )
    }
    return (
      <View>
      {
        data ? (
          <View>
            <import src='../towxml/entry.wxml' />
            <template is='entry' data='{{...data}}' />
          </View>
        ) : (
          <View className='loading' onLongClick={this.onTap}>
            <AtActivityIndicator size={20} color='#2d8cf0' content='loading...' />
          </View>
        )
      }
      </View>
    )
  }
}

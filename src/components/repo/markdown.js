import Taro, { Component } from '@tarojs/taro'
import PropTypes from 'prop-types'
import { View, Text } from '@tarojs/components'
import api from '../../service/api'
import { AtActivityIndicator } from 'taro-ui'
import { HTTP_STATUS } from '../../constants/status'

import './markdown.less'

export default class Markdown extends Component {
  static propTypes = {
    md: PropTypes.string
  }

  static defaultProps = {
    md: null
  }

  constructor(props) {
    super(props)
    this.state = {
      data: null,
      fail: false,
      is_first_tap: true
    }
  }

  componentDidMount() {
    this.parseReadme()
  }

  parseReadme() {
    const { md } = this.props
    let url = 'https://gitter-weapp.herokuapp.com/parse'
    let that = this
    let params = {
      type: 'markdown',
      content: md
    }
    api.post(url, params).then((res)=>{
      console.log(res)
      if (res.statusCode === HTTP_STATUS.SUCCESS) {
        that.setState({
          fail: false,
          data: res.data
        })
      } else {
        that.setState({
          fail: true
        })
      }
    })
  }

  onTap (e) {
    let that = this
    const { is_first_tap } = that.state
    if (is_first_tap) {
      console.log(e, e.currentTarget.dataset._el.attr.src)
    }
    that.setState({
      is_first_tap: false
    }, ()=>{
      setTimeout(()=>{
        that.setState({
          is_first_tap: true
        })
      }, 1000)
    })
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
          <View className='loading' onClick={this.onTap}>
            <AtActivityIndicator size={20} color='#2d8cf0' content='loading...' />
          </View>
        )
      }
      </View>
    )
  }
}

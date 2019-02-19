import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'

import { languages } from '../../assets/languages/languages'
import { AtIndexes } from 'taro-ui'

import './configLanguages.less'

class ConfigLanguages extends Component {

  config = {
    navigationBarTitleText: 'Config Languages'
  }

  constructor(props) {
    super(props)
    this.state = {
      url: null,
      comment: null
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onClick (item) {
    console.log(item)
  }

  render () {
    const list = [{
      title: 'A',
      key: 'A',
      items: [
        {
          'name': '阿坝'
          // 此处可加其他业务字段
        },
        {
          'name': '阿拉善'
        }]
    },
      {
        title: 'B',
        key: 'B',
        items: [
          {
            'name': '北京'
          },
          {
            'name': '保定'
          }]
      }
    ]
    return (
      <View style='height:100vh'>
        <AtIndexes
          list={languages}
          onClick={this.onClick.bind(this)}
        >
          <View>自定义内容</View>
        </AtIndexes>
      </View>
    )
  }
}

export default ConfigLanguages

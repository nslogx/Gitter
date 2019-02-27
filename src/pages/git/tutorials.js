import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtAccordion } from 'taro-ui'

import './tutorials.less'

class Tutorials extends Component {

  config = {
  }

  constructor(props) {
    super(props)
    this.state = {
      itemList: []
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  render() {
    return (
      <View className='content'>
      </View>
    )
  }
}

export default Tutorials

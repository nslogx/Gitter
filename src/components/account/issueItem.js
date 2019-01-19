import Taro, { Component } from '@tarojs/taro'
import PropTypes from 'prop-types';
import { View } from '@tarojs/components'


import './issueItem.less'

export default class IssueList extends Component {
  static propTypes = {
    item: PropTypes.object
  }

  static defaultProps = {
    item: null
  }

  render() {
    const { item } = this.props
    if (!item) return <View />
    return (
      <View className='content'>
        {item.title}
      </View>
    )
  }

}

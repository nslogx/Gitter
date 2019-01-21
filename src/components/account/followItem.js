import Taro, { Component } from '@tarojs/taro'
import PropTypes from 'prop-types';
import { View } from '@tarojs/components'
import { AtAvatar } from 'taro-ui'


import './followItem.less'

export default class FollowItem extends Component {
  static propTypes = {
    item: PropTypes.object,
  }

  static defaultProps = {
    item: null,
  }

  render() {
    const { item } = this.props
    if (!item) return <View />
    return (
      <View className='content'>
        <AtAvatar circle image={item.avatar_url} />
        <View className='user_name'>{item.login}</View>
      </View>
    )
  }

}

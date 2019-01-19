import Taro, { Component } from '@tarojs/taro'
import PropTypes from 'prop-types';
import { View, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

import './contentListItem.less'

export default class ContentListItem extends Component {
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
        <View className='title_view'>
          <AtIcon prefixClass='ion'
                  value={item.type === 'dir' ? 'ios-folder' : 'ios-document'}
                  size='20'
                  color='#7f7f7f' />
          <Text className='content_title'>{item.name}</Text>
        </View>
        {
          item.type === 'dir' &&
          <AtIcon prefixClass='ion' value='ios-arrow-forward' size='20' color='#7f7f7f' />
        }
      </View>
    )
  }
}

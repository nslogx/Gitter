import Taro, {Component} from '@tarojs/taro'
import PropTypes from 'prop-types';
import { View, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

import './gitItem.less'

export default class GitItem extends Component {
  static propTypes = {
    item: PropTypes.object
  }

  static defaultProps = {
    item: null
  }

  onClicked(item) {
    let value = encodeURI(JSON.stringify(item))
    Taro.navigateTo({
      url: `/pages/git/tutorials?value=${value}`
    })
  }

  render() {
    const { item } = this.props
    let list = null
    if (item && item.children) {
      list = item.children.map((sub_item, index)=>{
        return (
          <View className='title-view' key={index} onClick={this.onClicked.bind(this, sub_item)}>
            <Text className='title'>{sub_item.title}</Text>
            <AtIcon prefixClass='ion' value='ios-arrow-forward' size='18' color='#999999' />
          </View>
        )
      })
    }
    return (
      <View className='content'>
        <Text className='abstract'>{item.abstract}</Text>
        {list}
      </View>
    )
  }

}

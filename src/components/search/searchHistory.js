import Taro, { Component } from '@tarojs/taro'
import PropTypes from 'prop-types';
import { View, Input, Text } from '@tarojs/components'
import { AtTag } from 'taro-ui'

import './searchHistory.less'

export default class SearchHistory extends Component {

  static propTypes = {
    items: PropTypes.array,
    onTagClick: PropTypes.func
  }

  static defaultProps = {
    items: [],
    onTagClick: ()=>{}
  }

  componentWillMount() {
  }

  render() {
    const { items, onTagClick } = this.props
    const list = items.map((name, index) => {
      return <View key={index} className='tag-item'>
        <AtTag circle active onClick={onTagClick.bind(this)} name={name}>{name}</AtTag>
      </View>
    })
    return (
      <View className='content'>
        <View className='tag-view'>
          {list}
        </View>
      </View>
    )
  }
}

import Taro, { Component } from '@tarojs/taro'
import PropTypes from 'prop-types';
import { View, Text } from '@tarojs/components'

import './tab.less'

export default class Segment extends Component {

  static propTypes = {
    tabList: PropTypes.array,
    current: PropTypes.number,
    onTabClick: PropTypes.func
  }

  static defaultProps = {
    tabList: [],
    current: 0,
    onTabClick: () => {}
  }

  componentWillMount() {
  }

  render() {
    const { tabList, current } = this.props
    const tabs = tabList.map((tab, index) => {
      return <View key={index} className='item'>
        <View className={current === index ? 'item-select' : 'item-unselect'}
              onClick={this.props.onTabClick.bind(this, index)}>
          <Text>{tab}</Text>
          <View className={current === index ? 'item-underline-select' : 'item-underline-unselect'} />
        </View>
      </View>
    })
    return (
      <View className='content'>
        {tabs}
      </View>
    )
  }
}

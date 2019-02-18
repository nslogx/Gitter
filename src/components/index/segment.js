import Taro, { Component } from '@tarojs/taro'
import PropTypes from 'prop-types';
import { View } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

import Tab from './tab'

import './segment.less'

export default class Segment extends Component {

  static propTypes = {
    current: PropTypes.number,
    onTabChange: PropTypes.func,
    onRefresh: PropTypes.func
  }

  static defaultProps = {
    current: 0,
    onTabChange: () => {},
    onRefresh: () => {}
  }

  componentWillMount() {
  }

  onActionSearch () {
    Taro.navigateTo({
      url: '/pages/search/index'
    })
  }

  render() {
    const { current, onTabChange, onRefresh } = this.props
    return (
      <View className='content'>
        <AtIcon value='reload' size='22' color='#333' onClick={onRefresh} />
        <Tab tabList={['REPO', 'USER']} current={current} onTabClick={onTabChange.bind(this)} />
        <AtIcon value='search' size='22' color='#333' onClick={this.onActionSearch.bind(this)} />
      </View>
    )
  }
}

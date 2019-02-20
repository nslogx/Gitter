import Taro, { Component } from '@tarojs/taro'
import PropTypes from 'prop-types';
import { View } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

import Tab from './tab'

import './segment.less'

export default class Segment extends Component {

  static propTypes = {
    current: PropTypes.number,
    onTabChange: PropTypes.func
  }

  static defaultProps = {
    current: 0,
    onTabChange: () => {}
  }

  componentWillMount() {
  }

  onActionSearch () {
    Taro.navigateTo({
      url: '/pages/search/index'
    })
  }

  onActionConfig () {
    Taro.navigateTo({
      url: '/pages/index/favoriteLanguages'
    })
  }

  render() {
    const { current, onTabChange } = this.props
    return (
      <View className='content'>
        <View className='action-view' onClick={this.onActionConfig.bind(this)}>
          <AtIcon value='filter' size='22' color='#333' />
        </View>
        <Tab tabList={['REPO', 'USER']} current={current} onTabClick={onTabChange.bind(this)} />
        <View className='action-view' onClick={this.onActionSearch.bind(this)}>
          <AtIcon value='search' size='22' color='#333' />
        </View>
      </View>
    )
  }
}

import {Component} from '@tarojs/taro'
import PropTypes from 'prop-types';
import { View } from '@tarojs/components'
import { AtActivityIndicator } from 'taro-ui'
import { REFRESH_STATUS } from '../../constants/status'

import './loadMore.less'

export default class LoadMore extends Component {
  static propTypes = {
    status: PropTypes.number,
  }

  static defaultProps = {
    status: REFRESH_STATUS.NORMAL
  }

  render() {
    const {status} = this.props

    let view = null
    switch (status) {
      case REFRESH_STATUS.NORMAL: {
        view = <View className='normal' />
      }
        break
      case REFRESH_STATUS.REFRESHING: {
        view = (
          <View className='loading'>
            <AtActivityIndicator size={15} color='#2d8cf0' content='loading...' />
          </View>
        )
      }
        break
      case REFRESH_STATUS.NO_MORE_DATA: {
        view = <View className='no-more-data'>-- No More Data --</View>
      }
    }
    return (
      <View className='content'>
        {view}
      </View>
    )
  }

}

import Taro, { Component } from '@tarojs/taro'
import PropTypes from 'prop-types';
import { View } from '@tarojs/components'

import IssueItem from './issueItem'

import './issueList.less'

export default class IssueList extends Component {
  static propTypes = {
    itemList: PropTypes.array
  }

  static defaultProps = {
    itemList: null
  }

  render() {
    const { itemList } = this.props
    if (!itemList) return <View />
    return (
      <View className='content'>
        {
          itemList.map((item, index) => {
            return (
              <IssueItem item={item} key={index} />
            )
          })
        }
      </View>
    )
  }

}

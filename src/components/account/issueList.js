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

  handleClicked(item) {
    Taro.navigateTo({
      url: '/pages/repo/issueDetail?url=' + item.url
    })
  }

  render() {
    const { itemList } = this.props
    if (!itemList) return <View />
    return (
      <View className='content'>
        {
          itemList.map((item, index) => {
            return (
              <View onClick={this.handleClicked.bind(this, item)} key={index}>
                <IssueItem item={item} />
              </View>
            )
          })
        }
      </View>
    )
  }
}

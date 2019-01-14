import Taro, { Component } from '@tarojs/taro'
import PropTypes from 'prop-types';
import { View } from '@tarojs/components'

import TrendingRepoItem from './trendingRepoItem'
import TrendingDeveloperItem from './trendingDeveloperItem'

export default class ItemList extends Component {

  static propTypes = {
    type: PropTypes.number,
    itemList: PropTypes.array,
    categoryType: PropTypes.number
  }

  static defaultProps = {
    type: 0,
    categoryType: 0,
    itemList: []
  }

  componentWillMount() {
  }

  render() {
    const { itemList, type, categoryType } = this.props
    let list
    switch (type) {
      case 0: {
        list = itemList.map((item, index) => {
          return (
            <View key={index}>
              <TrendingRepoItem item={item} categoryType={categoryType} />
            </View>
          )
        })
      }
      case 1: {
        list = itemList.map((item, index) => {
          return (
            <View key={index}>
              <TrendingDeveloperItem item={item} />
            </View>
          )
        })
      }
    }
    return (
      <View>
        {
          list
        }
      </View>
    )
  }
}

import Taro, { Component } from '@tarojs/taro'
import PropTypes from 'prop-types';
import { View, Text } from '@tarojs/components'

export default class itemList extends Component {

  static propTypes = {
    type: PropTypes.number,
    itemList: PropTypes.array
  }

  static defaultProps = {
    type: 0,
    itemList: []
  }

  componentWillMount() {
  }

  render() {
    const { itemList, type } = this.props
    let list
    switch (type) {
      case 0: {
        list = itemList.map((item, index) => {
          return (
            <View key={index}>
              {item.description}
            </View>
          )
        })
      }
      case 1: {
        list = itemList.map((item, index) => {
          return (
            <View key={index}>
              {item.repo.description}
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

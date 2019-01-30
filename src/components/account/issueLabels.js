import Taro, { Component } from '@tarojs/taro'
import PropTypes from 'prop-types';
import { View } from '@tarojs/components'
import { AtTag } from 'taro-ui'


import './issueLabels.less'

export default class IssueLabels extends Component {
  static propTypes = {
    items: PropTypes.array
  }

  static defaultProps = {
    items: []
  }

  render() {
    const { items } = this.props
    if (items.length === 0) return <View />
    return (
      <View className='content'>
        {
          items.map((item, index) => {
            let customStyle = `background-color: #${item.color}; border: none;`
            return (
              <View key={index} className='tag'>
                <AtTag circle active type='primary' size='small' customStyle={customStyle}>
                  {item.name}
                </AtTag>
              </View>
            )
          })
        }
      </View>
    )
  }

}

import Taro, { Component } from '@tarojs/taro'
import PropTypes from 'prop-types';
import { View } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import { formatTime } from '../../utils/common'


import './repoItem.less'

export default class RepoItem extends Component {
  static propTypes = {
    item: PropTypes.object,
  }

  static defaultProps = {
    item: null,
  }

  render() {
    const { item } = this.props
    if (!item) return <View/>
    let update_date = new Date(item.updated_at)
    let update_time = ' ' + formatTime(update_date)
    let is_bottom_show = (item.language && item.language.length > 0 || item.stargazers_count > 0 || item.forks_count > 0)
    return (
      <View className='content'>
        <View className='repo_title_view'>
          <AtIcon prefixClass='ion' value='md-bookmarks' size='25' color='#333'/>
          <View className='repo_title'>{item.full_name}</View>
        </View>
        <View className='repo_desc'>{item.description}</View>
        {is_bottom_show &&
        <View className='repo_bottom'>
          {
            item.language.length > 0 &&
            <View className='repo_number_item'>
              <AtIcon prefixClass='ion' value='ios-radio-button-on' size='15' color='#9ca0b3'/>
              <View className='repo_number_title'>{item.language}</View>
            </View>
          }
          {
            item.stargazers_count > 0 &&
            <View className='repo_number_item'>
              <AtIcon prefixClass='ion' value='ios-star' size='15' color='#9ca0b3'/>
              <View className='repo_number_title'>{item.stargazers_count}</View>
            </View>
          }
          {
            item.forks_count > 0 &&
            <View className='repo_number_item'>
              <AtIcon prefixClass='ion' value='ios-git-network' size='15' color='#9ca0b3'/>
              <View className='repo_number_title'>{item.forks_count}</View>
            </View>
          }
        </View>
        }
        <View className='update_date'>updated on{update_time}</View>
      </View>
    )
  }

}

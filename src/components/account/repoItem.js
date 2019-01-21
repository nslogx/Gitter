import Taro, { Component } from '@tarojs/taro'
import PropTypes from 'prop-types'
import { View, Navigator, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import { timeago } from '../../utils/common'


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
    let update_time = ' ' + timeago(Date.parse(new Date(item.updated_at)))
    let is_bottom_show = (item.language && item.language.length > 0 || item.stargazers_count > 0 || item.forks_count > 0)
    return (
      <View className='content'>
        <View className='repo_title_view'>
          <AtIcon prefixClass='ion' value='md-bookmarks' size='25' color='#333'/>
          <View className='repo_title'>{item.full_name}</View>
        </View>
        <View className='repo_desc'>{item.description || 'no description'}</View>
        {is_bottom_show &&
        <View className='repo_bottom'>
          {
            item.language.length > 0 &&
            <View className='repo_number_item'>
              <AtIcon prefixClass='ion' value='ios-radio-button-on' size='16' color='#7f7f7f'/>
              <View className='repo_number_title'>{item.language}</View>
            </View>
          }
          {
            item.stargazers_count > 0 &&
            <View className='repo_number_item'>
              <AtIcon prefixClass='ion' value='ios-star' size='16' color='#7f7f7f'/>
              <View className='repo_number_title'>{item.stargazers_count}</View>
            </View>
          }
          {
            item.forks_count > 0 &&
            <View className='repo_number_item'>
              <AtIcon prefixClass='ion' value='ios-git-network' size='16' color='#7f7f7f'/>
              <View className='repo_number_title'>{item.forks_count}</View>
            </View>
          }
        </View>
        }
        <View className='update_view'>
          <AtIcon prefixClass='ion' value='ios-trending-up' size='15' color='#ff4949'/>
          <View className='update_date'>updated{update_time}</View>
        </View>
      </View>
    )
  }

}

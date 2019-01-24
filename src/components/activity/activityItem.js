import Taro, { Component } from '@tarojs/taro'
import PropTypes from 'prop-types'
import { View, Navigator, Text } from '@tarojs/components'
import { AtAvatar } from 'taro-ui'
import { timeago } from '../../utils/common'


import './activityItem.less'

export default class ActivityItem extends Component {
  static propTypes = {
    item: PropTypes.object,
  }

  static defaultProps = {
    item: null,
  }

  render() {
    const { item } = this.props
    if (!item) return <View />
    let created_at = timeago(Date.parse(new Date(item.created_at)))
    let activity = null
    if (item.type === 'WatchEvent') {
      activity = (
        <View className='activity'>
          <View className='activity_desc'>
            <Navigator url={'/pages/account/developerInfo?username=' + item.actor.login} >
              <Text className='username'>
                {item.actor.login}
              </Text>
            </Navigator>
            <Navigator url='' hoverClass='none' >
              <Text className='text'>starred</Text>
            </Navigator>
            <Navigator url={'/pages/repo/repo?url=' + decodeURI(item.repo.url)} >
              <Text className='username'>
                {item.repo.name}
              </Text>
            </Navigator>
          </View>
          <Text className='time'>
            {created_at}
          </Text>
        </View>
      )
    } else if (item.type === 'CreateEvent') {
      activity = (
        <View className='activity'>
          <View className='activity_desc'>
            <Navigator url={'/pages/account/developerInfo?username=' + item.actor.login} >
              <Text className='username'>
                {item.actor.login}
              </Text>
            </Navigator>
            <Navigator url='' hoverClass='none' >
              <Text className='text'>{'created a ' + item.payload.ref_type}</Text>
            </Navigator>
            <Navigator url={'/pages/repo/repo?url=' + decodeURI(item.repo.url)} >
              <Text className='username'>
                {item.repo.name}
              </Text>
            </Navigator>
          </View>
          <Text className='time'>
            {created_at}
          </Text>
        </View>
      )
    } else if (item.type === 'ForkEvent') {
      activity = (
        <View className='activity'>
          <View className='activity_desc'>
            <Navigator url={'/pages/account/developerInfo?username=' + item.actor.login} >
              <Text className='username'>
                {item.actor.login}
              </Text>
            </Navigator>
            <Navigator url='' hoverClass='none' >
              <Text className='text'>forked</Text>
            </Navigator>
            <Navigator url={'/pages/repo/repo?url=' + decodeURI(item.payload.forkee.url)} >
              <Text className='username'>
                {item.payload.forkee.full_name}
              </Text>
            </Navigator>
            <Navigator url='' hoverClass='none' >
              <Text className='text'>from</Text>
            </Navigator>
            <Navigator url={'/pages/repo/repo?url=' + decodeURI(item.repo.url)} >
              <Text className='username'>
                {item.repo.name}
              </Text>
            </Navigator>
          </View>
          <Text className='time'>
            {created_at}
          </Text>
        </View>
      )
    } else if (item.type === 'IssuesEvent') {
      activity = (
        <View className='activity'>
          <View className='activity_desc'>
            <Navigator url={'/pages/account/developerInfo?username=' + item.actor.login} >
              <Text className='username'>
                {item.actor.login}
              </Text>
            </Navigator>
            <Navigator url='' hoverClass='none' >
              <Text className='text'>{item.payload.action + ' a issue in'}</Text>
            </Navigator>
            <Navigator url={'/pages/repo/repo?url=' + decodeURI(item.repo.url)} >
              <Text className='username'>
                {item.repo.name}
              </Text>
            </Navigator>
          </View>
          <Text className='time'>
            {created_at}
          </Text>
        </View>
      )
    } else if (item.type === 'IssueCommentEvent') {
      activity = (
        <View className='activity'>
          <View className='activity_desc'>
            <Navigator url={'/pages/account/developerInfo?username=' + item.actor.login} >
              <Text className='username'>
                {item.actor.login}
              </Text>
            </Navigator>
            <Navigator url='' hoverClass='none' >
              <Text className='text'>{item.payload.action + ' a issue comment in'}</Text>
            </Navigator>
            <Navigator url={'/pages/repo/repo?url=' + decodeURI(item.repo.url)} >
              <Text className='username'>
                {item.repo.name}
              </Text>
            </Navigator>
          </View>
          <Text className='time'>
            {created_at}
          </Text>
        </View>
      )
    } else if (item.type === 'FollowEvent') {
      activity = (
        <View className='activity'>
          <View className='activity_desc'>
            <Navigator url={'/pages/account/developerInfo?username=' + item.actor.login} >
              <Text className='username'>
                {item.actor.login}
              </Text>
            </Navigator>
            <Navigator url='' hoverClass='none' >
              <Text className='text'>starred following</Text>
            </Navigator>
            <Navigator url={'/pages/account/developerInfo?username=' + item.payload.target.login} >
              <Text className='username'>
                {item.payload.target.login}
              </Text>
            </Navigator>
          </View>
          <Text className='time'>
            {created_at}
          </Text>
        </View>
      )
    } else if (item.type === 'PushEvent') {
      activity = (
        <View className='activity'>
          <View className='activity_desc'>
            <Navigator url={'/pages/account/developerInfo?username=' + item.actor.login} >
              <Text className='username'>
                {item.actor.login}
              </Text>
            </Navigator>
            <Navigator url='' hoverClass='none' >
              <Text className='text'>pushed commits in</Text>
            </Navigator>
            <Navigator url={'/pages/repo/repo?url=' + decodeURI(item.repo.url)} >
              <Text className='username'>
                {item.repo.name}
              </Text>
            </Navigator>
          </View>
          <Text className='time'>
            {created_at}
          </Text>
        </View>
      )
    } else if (item.type === 'PullRequestEvent') {
      activity = (
        <View className='activity'>
          <View className='activity_desc'>
            <Navigator url={'/pages/account/developerInfo?username=' + item.actor.login} >
              <Text className='username'>
                {item.actor.login}
              </Text>
            </Navigator>
            <Navigator url='' hoverClass='none' >
              <Text className='text'>{item.payload.action + ' a PullRequest in'}</Text>
            </Navigator>
            <Navigator url={'/pages/repo/repo?url=' + decodeURI(item.repo.url)} >
              <Text className='username'>
                {item.repo.name}
              </Text>
            </Navigator>
          </View>
          <Text className='time'>
            {created_at}
          </Text>
        </View>
      )
    } else if (item.type === 'PullRequestReviewCommentEvent') {
      activity = (
        <View className='activity'>
          <View className='activity_desc'>
            <Navigator url={'/pages/account/developerInfo?username=' + item.actor.login} >
              <Text className='username'>
                {item.actor.login}
              </Text>
            </Navigator>
            <Navigator url='' hoverClass='none' >
              <Text className='text'>{item.payload.action + ' a pullRequest comment in'}</Text>
            </Navigator>
            <Navigator url={'/pages/repo/repo?url=' + decodeURI(item.repo.url)} >
              <Text className='username'>
                {item.repo.name}
              </Text>
            </Navigator>
          </View>
          <Text className='time'>
            {created_at}
          </Text>
        </View>
      )
    } else if (item.type === 'CommitCommentEvent') {
      activity = (
        <View className='activity'>
          <View className='activity_desc'>
            <Navigator url={'/pages/account/developerInfo?username=' + item.actor.login} >
              <Text className='username'>
                {item.actor.login}
              </Text>
            </Navigator>
            <Navigator url='' hoverClass='none' >
              <Text className='text'>creates a commit comment in </Text>
            </Navigator>
            <Navigator url={'/pages/repo/repo?url=' + decodeURI(item.repo.url)} >
              <Text className='username'>
                {item.repo.name}
              </Text>
            </Navigator>
          </View>
          <Text className='time'>
            {created_at}
          </Text>
        </View>
      )
    } else if (item.type === 'DeleteEvent') {
      activity = (
        <View className='activity'>
          <View className='activity_desc'>
            <Navigator url={'/pages/account/developerInfo?username=' + item.actor.login} >
              <Text className='username'>
                {item.actor.login}
              </Text>
            </Navigator>
            <Navigator url='' hoverClass='none' >
              <Text className='text'>{'deleted a ' + item.payload.ref_type + ' in'}</Text>
            </Navigator>
            <Navigator url={'/pages/repo/repo?url=' + decodeURI(item.repo.url)} >
              <Text className='username'>
                {item.repo.name}
              </Text>
            </Navigator>
          </View>
          <Text className='time'>
            {created_at}
          </Text>
        </View>
      )
    } else if (item.type === 'MemberEvent') {
      activity = (
        <View className='activity'>
          <View className='activity_desc'>
            <Navigator url={'/pages/account/developerInfo?username=' + item.actor.login} >
              <Text className='username'>
                {item.actor.login}
              </Text>
            </Navigator>
            <Navigator url='' hoverClass='none' >
              <Text className='text'>{item.payload.action + ' a member in'}</Text>
            </Navigator>
            <Navigator url={'/pages/repo/repo?url=' + decodeURI(item.repo.url)} >
              <Text className='username'>
                {item.repo.name}
              </Text>
            </Navigator>
          </View>
          <Text className='time'>
            {created_at}
          </Text>
        </View>
      )
    } else if (item.type === 'PublicEvent') {
      activity = (
        <View className='activity'>
          <View className='activity_desc'>
            <Navigator url={'/pages/account/developerInfo?username=' + item.actor.login} >
              <Text className='username'>
                {item.actor.login}
              </Text>
            </Navigator>
            <Navigator url='' hoverClass='none' >
              <Text className='text'>make</Text>
            </Navigator>
            <Navigator url={'/pages/repo/repo?url=' + decodeURI(item.repo.url)} >
              <Text className='username'>
                {item.repo.name}
              </Text>
            </Navigator>
            <Navigator url='' hoverClass='none' >
              <Text className='text'>public</Text>
            </Navigator>
          </View>
          <Text className='time'>
            {created_at}
          </Text>
        </View>
      )
    }

    return (
      <View className='content'>
        <AtAvatar circle image={item.actor.avatar_url} />
        {activity}
      </View>
    )
  }
}

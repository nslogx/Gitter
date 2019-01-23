import Taro, { Component } from '@tarojs/taro'
import {Image, Text, View, Button} from '@tarojs/components'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'
import { AtAvatar, AtIcon } from 'taro-ui'
import { NAVIGATE_TYPE } from '../../constants/navigateType'
import { hasLogin } from '../../utils/common'
import api from '../../service/api'

import './developerInfo.less'
import {baseUrl} from "../../service/config";

class DeveloperInfo extends Component {

  config = {
    navigationBarTitleText: '',
    navigationBarBackgroundColor: '#2d8cf0',
    navigationBarTextStyle: 'white',
    enablePullDownRefresh: true
  }

  constructor(props) {
    super(props)
    this.state = {
      username: '',
      developerInfo: null,
      isFollowed: false,
      isShare: false
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount() {
    let params = this.$router.params
    this.setState({
      username: params.username,
      isShare: params.share
    })
  }

  componentDidMount() {
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
    this.getDeveloperInfo()
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onPullDownRefresh() {
    this.getDeveloperInfo()
  }

  getDeveloperInfo() {
    const { username } = this.state
    let that = this
    let url = '/users/' + username
    api.get(url).then((res)=>{
      that.setState({
        developerInfo: res.data
      }, ()=>{
        that.checkFollowing()
      })
      Taro.hideLoading()
    })
  }

  checkFollowing() {
    if (hasLogin()) {
      let that = this
      const { username } = this.state
      let url = '/user/following/' + username
      api.get(url).then((res)=>{
        Taro.stopPullDownRefresh()
        that.setState({
          isFollowed: res.statusCode === 204
        })
      })
    }
  }

  handleFollow() {
    const { isFollowed, username } = this.state
    let url = '/user/following/' + username
    let that = this
    if (isFollowed) {
      api.delete(url).then((res)=>{
        if (res.statusCode === 204) {
          that.setState({
            isFollowed: false
          })
        }
      })
    } else {
      api.put(url).then((res)=>{
        if (res.statusCode === 204) {
          that.setState({
            isFollowed: true
          })
        }
      })
    }
  }

  handleNavigate(type) {
    const { developerInfo } = this.state
    switch (type) {
      case NAVIGATE_TYPE.REPOS: {
        Taro.navigateTo({
          url: '/pages/repo/repoList?url=' + encodeURI(developerInfo.repos_url)
        })
      }
        break
      case NAVIGATE_TYPE.FOLLOWERS: {
        Taro.navigateTo({
          url: '/pages/account/follow?type=followers&username=' + developerInfo.login
        })
      }
        break
      case NAVIGATE_TYPE.FOLLOWING: {
        Taro.navigateTo({
          url: '/pages/account/follow?type=following&username=' + developerInfo.login
        })
      }
        break
      case NAVIGATE_TYPE.STARRED_REPOS: {
        Taro.navigateTo({
          url: '/pages/repo/starredRepo?username=' + developerInfo.login
        })
      }
        break
      case NAVIGATE_TYPE.ISSUES: {
        Taro.navigateTo({
          url: '/pages/repo/issues?url=/user/issues'
        })
      }
        break
      default: {

      }
    }
  }
  onShareAppMessage(obj) {
    const { developerInfo } = this.state
    return {
      title: (developerInfo.name || developerInfo.login) + ' - GitHub',
      path: '/pages/account/developerInfo?username=' + developerInfo.login + '&share=true'
    }
  }

  onClickedHome () {
    Taro.reLaunch({
      url: '/pages/index/index'
    })
  }

  render() {
    const { developerInfo, isFollowed, isShare } = this.state
    if (!developerInfo) return <View />
    return (
      <View className='content'>
        <Image className='account_bg' src={require('../../assets/images/account_bg.png')}/>
        <View className='user_info'>
          <AtAvatar className='avatar' circle image={developerInfo.avatar_url}/>
          <Text className='username'>
            {developerInfo.name || developerInfo.login}
          </Text>
          <View className='login_name'>@{developerInfo.login}</View>
        </View>
        <View className='info_view'>
          {developerInfo.bio.length > 0 && <View className='bio'>{developerInfo.bio}</View>}
          <View className='item_view'>
            <View className='item' onClick={this.handleNavigate.bind(this, NAVIGATE_TYPE.REPOS)}>
              <View className='title'>{developerInfo.public_repos}</View>
              <View className='desc'>Repos</View>
            </View>
            <View className='line'/>
            <View className='item' onClick={this.handleNavigate.bind(this, NAVIGATE_TYPE.FOLLOWERS)}>
              <View className='title'>{developerInfo.followers}</View>
              <View className='desc'>Followers</View>
            </View>
            <View className='line'/>
            <View className='item' onClick={this.handleNavigate.bind(this, NAVIGATE_TYPE.FOLLOWING)}>
              <View className='title'>{developerInfo.following}</View>
              <View className='desc'>Following</View>
            </View>
          </View>
          <View className='button_view'>
            {
              developerInfo.type === 'User' &&
              <Button className='button' onClick={this.handleFollow.bind(this)}>
                {isFollowed ? 'Unfollow' : 'Follow'}
              </Button>
            }
            <Button className='button' openType='share'>Share</Button>
          </View>
        </View>
        <View className='list_view'>
          <View className='list' onClick={this.handleNavigate.bind(this, NAVIGATE_TYPE.STARRED_REPOS)}>
            <View className='list_title'>Starred Repos</View>
            <AtIcon prefixClass='ion' value='ios-arrow-forward' size='20' color='#7f7f7f' />
          </View>
          {/*<View className='list' onClick={this.handleNavigate.bind(this, NAVIGATE_TYPE.EVENTS)}>*/}
            {/*<View className='list_title'>Events</View>*/}
            {/*<AtIcon prefixClass='ion' value='ios-arrow-forward' size='20' color='#7f7f7f' />*/}
          {/*</View>*/}
        </View>
        <View className='list_view'>
          <View className='list'>
            <View className='list_title'>Email</View>
            <View className='list_content'>{developerInfo.email.length > 0 ? developerInfo.email : '--'}</View>
          </View>
          <View className='list'>
            <View className='list_title'>Blog</View>
            <View className='list_content'>{developerInfo.blog.length > 0 ? developerInfo.blog : '--'}</View>
          </View>
          <View className='list'>
            <View className='list_title'>Company</View>
            <View className='list_content'>{developerInfo.company.length > 0 ? developerInfo.company : '--'}</View>
          </View>
          <View className='list'>
            <View className='list_title'>Location</View>
            <View className='list_content'>{developerInfo.location.length > 0 ? developerInfo.location : '--'}</View>
          </View>
        </View>
        <View className='bottom_view' />
        {
          isShare &&
          <View className='home_view' onClick={this.onClickedHome.bind(this)}>
            <AtIcon prefixClass='ion'
                    value='ios-home'
                    size='30'
                    color='#fff' />
          </View>
        }
      </View>
    )
  }
}
export default DeveloperInfo

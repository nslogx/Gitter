import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtAvatar, AtIcon } from 'taro-ui'
import { NAVIGATE_TYPE } from '../../constants/navigateType'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'
import { baseUrl } from '../../service/config'
import userAction from '../../actions/user'

import './index.less'

class Index extends Component {

  config = {
    navigationBarTitleText: '',
    navigationBarBackgroundColor: '#2d8cf0',
    navigationBarTextStyle: 'white',
    enablePullDownRefresh: true
  }

  constructor(props) {
    super(props)
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentDidMount() {
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
    this.getUserInfo()
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  onPullDownRefresh() {
    this.getUserInfo()
  }

  getUserInfo() {
    userAction.getUserInfo().then(()=>{
      Taro.hideLoading()
      Taro.stopPullDownRefresh()
    })
  }

  handleNavigate(type) {
    const { userInfo } = this.props
    switch (type) {
      case NAVIGATE_TYPE.REPOS: {
        let url = encodeURI(baseUrl + '/user/repos')
        Taro.navigateTo({
          url: '/pages/repo/repoList?url=' + url
        })
      }
      break
      case NAVIGATE_TYPE.FOLLOWERS: {
        Taro.navigateTo({
          url: '/pages/account/follow?type=followers'
        })
      }
      break
      case NAVIGATE_TYPE.FOLLOWING: {
        Taro.navigateTo({
          url: '/pages/account/follow?type=following'
        })
      }
      break
      case NAVIGATE_TYPE.STARRED_REPOS: {
        Taro.navigateTo({
          url: '/pages/repo/starredRepo'
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

  render() {
    const {userInfo} = this.props
    if (!userInfo) return <View/>
    return (
      <View className='content'>
        <Image className='account_bg' src={require('../../assets/images/account_bg.png')}/>
        <View className='user_info'>
          <AtAvatar className='avatar' circle image={userInfo.avatar_url}/>
          <Text className='username'>{userInfo.name}</Text>
          <View className='login_name'>@{userInfo.login}</View>
        </View>
        <View className='info_view'>
          {userInfo.bio.length > 0 && <View className='bio'>{userInfo.bio}</View>}
          <View className='item_view'>
            <View className='item' onClick={this.handleNavigate.bind(this, NAVIGATE_TYPE.REPOS)}>
              <View className='title'>{userInfo.public_repos}+{userInfo.owned_private_repos}</View>
              <View className='desc'>Repos</View>
            </View>
            <View className='line'/>
            <View className='item' onClick={this.handleNavigate.bind(this, NAVIGATE_TYPE.FOLLOWERS)}>
              <View className='title'>{userInfo.followers}</View>
              <View className='desc'>Followers</View>
            </View>
            <View className='line'/>
            <View className='item' onClick={this.handleNavigate.bind(this, NAVIGATE_TYPE.FOLLOWING)}>
              <View className='title'>{userInfo.following}</View>
              <View className='desc'>Following</View>
            </View>
          </View>
        </View>
        <View className='list_view'>
          <View className='list' onClick={this.handleNavigate.bind(this, NAVIGATE_TYPE.STARRED_REPOS)}>
            <View className='list_title'>Starred Repos</View>
            <AtIcon prefixClass='ion' value='ios-arrow-forward' size='18' color='#7f7f7f' />
          </View>
          <View className='list' onClick={this.handleNavigate.bind(this, NAVIGATE_TYPE.EVENTS)}>
            <View className='list_title'>Events</View>
            <AtIcon prefixClass='ion' value='ios-arrow-forward' size='18' color='#7f7f7f' />
          </View>
          <View className='list' onClick={this.handleNavigate.bind(this, NAVIGATE_TYPE.ISSUES)}>
            <View className='list_title'>Issues</View>
            <AtIcon prefixClass='ion' value='ios-arrow-forward' size='18' color='#7f7f7f' />
          </View>
        </View>
        <View className='list_view'>
          <View className='list'>
            <View className='list_title'>Email</View>
            <View className='list_content'>{userInfo.email.length > 0 ? userInfo.email : '--'}</View>
          </View>
          <View className='list'>
            <View className='list_title'>Blog</View>
            <View className='list_content'>{userInfo.blog.length > 0 ? userInfo.blog : '--'}</View>
          </View>
          <View className='list'>
            <View className='list_title'>Company</View>
            <View className='list_content'>{userInfo.company.length > 0 ? userInfo.company : '--'}</View>
          </View>
          <View className='list'>
            <View className='list_title'>Location</View>
            <View className='list_content'>{userInfo.location.length > 0 ? userInfo.location : '--'}</View>
          </View>
        </View>
        <View className='bottom_view' />
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    userInfo: state.user.userInfo
  }
}
export default connect(mapStateToProps)(Index)

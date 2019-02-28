import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtAvatar, AtIcon } from 'taro-ui'
import { NAVIGATE_TYPE } from '../../constants/navigateType'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'
import { baseUrl } from '../../service/config'
import userAction from '../../actions/user'
import { hasLogin } from '../../utils/common'

import './index.less'
import api from "../../service/api";

class Index extends Component {

  config = {
    navigationBarTitleText: '',
    navigationBarBackgroundColor: '#2d8cf0',
    navigationBarTextStyle: 'white',
    enablePullDownRefresh: true
  }

  constructor(props) {
    super(props)
    this.state = {
      isLogin: false,
      hasStar: true
    }
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
    this.setState({
      isLogin: hasLogin()
    })
  }

  componentDidHide() {
  }

  onPullDownRefresh() {
    this.getUserInfo()
  }

  getUserInfo() {
    if (hasLogin()) {
      userAction.getUserInfo().then(()=>{
        Taro.hideLoading()
        Taro.stopPullDownRefresh()
        this.checkStarring()
      })
    } else {
      Taro.hideLoading()
      Taro.stopPullDownRefresh()
    }
  }

  checkStarring() {
    if (hasLogin()) {
      let that = this
      let url = '/user/starred/huangjianke/Gitter'
      api.get(url).then((res)=>{
        that.setState({
          hasStar: res.statusCode === 204
        })
      })
    }
  }

  handleNavigate(type) {
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
      case NAVIGATE_TYPE.ABOUT: {
        Taro.navigateTo({
          url: '/pages/account/about'
        })
      }
      break
      case NAVIGATE_TYPE.STAR: {
        this.handleStar()
      }
      break
      case NAVIGATE_TYPE.FEEDBACK: {
        Taro.navigateToMiniProgram({
          appId: 'wx8abaf00ee8c3202e',
          extraData: {
            id: '55362',
            customData: {}
          }
        })
      }
      break
      default: {
      }
    }
  }

  login() {
    Taro.navigateTo({
      url: '/pages/login/login'
    })
  }

  handleStar() {
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
    let url = '/user/starred/huangjianke/Gitter'
    api.put(url).then((res)=>{
      Taro.hideLoading()
      if (res.statusCode === 204) {
        Taro.showToast({
          title: 'Thank you!',
          icon: 'success'
        })
        setTimeout(()=>{
          this.getUserInfo()
        }, 1000)
      }
    })
  }

  render() {
    const { isLogin, hasStar } = this.state
    const { userInfo } = this.props

    let repo_counts = userInfo ? Number(userInfo.public_repos) : 0
    if (userInfo && userInfo.owned_private_repos > 0) {
      repo_counts +=  Number(userInfo.owned_private_repos)
    }

    return (
      <View>
        {
          isLogin ? (
            <View className='content'>
              <Image className='account_bg' src={require('../../assets/images/account_bg.png')}/>
              <View className='user_info'>
                <AtAvatar className='avatar' circle image={userInfo.avatar_url}/>
                {
                  userInfo.name.length > 0 &&
                  <Text className='username'>{userInfo.name}</Text>
                }
                <View className='login_name'>@{userInfo.login}</View>
              </View>
              <View className='info_view'>
                {userInfo.bio.length > 0 && <View className='bio'>{userInfo.bio}</View>}
                <View className='item_view'>
                  <View className='item' onClick={this.handleNavigate.bind(this, NAVIGATE_TYPE.REPOS)}>
                    <View className='title'>{userInfo ? repo_counts : ''}</View>
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
              {
                !hasStar && (
                  <View className='list_view'>
                    <View className='list' onClick={this.handleNavigate.bind(this, NAVIGATE_TYPE.STAR)}>
                      <View className='list_title'>Star Gitter ❤</View>
                      <AtIcon prefixClass='ion' value='ios-arrow-forward' size='18' color='#7f7f7f' />
                    </View>
                  </View>
                )
              }
              <View className='list_view'>
                <View className='list' onClick={this.handleNavigate.bind(this, NAVIGATE_TYPE.STARRED_REPOS)}>
                  <View className='list_title'>Starred Repos</View>
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
              <View className='list_view'>
                <View className='list' onClick={this.handleNavigate.bind(this, NAVIGATE_TYPE.FEEDBACK)}>
                  <View className='list_title'>Feedback</View>
                  <AtIcon prefixClass='ion' value='ios-arrow-forward' size='18' color='#7f7f7f' />
                </View>
                <View className='list' onClick={this.handleNavigate.bind(this, NAVIGATE_TYPE.ABOUT)}>
                  <View className='list_title'>About</View>
                  <AtIcon prefixClass='ion' value='ios-arrow-forward' size='18' color='#7f7f7f' />
                </View>
              </View>
              <View className='bottom_view' />
            </View>
          ) : (
            <View className='content'>
              <Image mode='aspectFit'
                     className='logo'
                     src={require('../../assets/images/octocat.png')} />
              <View className='login_button'
                    onClick={this.login.bind(this)}>
                Login
              </View>
            </View>
          )
        }
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

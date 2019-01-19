import Taro, { Component } from '@tarojs/taro'
import {Image, Text, View, Button} from '@tarojs/components'
import { connect } from '@tarojs/redux'
import userAction from '../../actions/user'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'

import './developerInfo.less'
import {AtAvatar, AtIcon} from "taro-ui";
import {NAVIGATE_TYPE} from "../../constants/navigateType";

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
      username: ''
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount() {
    let params = this.$router.params
    console.log(params)
    this.setState({
      username: params.username
    })
  }

  componentDidMount() {
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
    this.getDeveloperInfo()
    this.checkFollowing()
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onPullDownRefresh() {
    this.getDeveloperInfo()
    this.checkFollowing()
  }

  getDeveloperInfo() {
    let params = {
      url: '/users/' + this.state.username
    }
    userAction.getDeveloperInfo(params).then(()=>{
      Taro.hideLoading()
      Taro.stopPullDownRefresh()
    })
  }

  checkFollowing() {
    let params = {
      url: '/user/following/' + this.state.username
    }
    userAction.checkFollowing(params)
  }

  onShareAppMessage(obj) {
    const { developerInfo } = this.props
    return {
      title: (developerInfo.name || developerInfo.login) + ' - GitHub',
      path: '/pages/account/developerInfo?username=' + developerInfo.login
    }
  }

  render() {
    const { developerInfo, isFollowed } = this.props
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
              <Button className='button'>
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
          <View className='list' onClick={this.handleNavigate.bind(this, NAVIGATE_TYPE.EVENTS)}>
            <View className='list_title'>Events</View>
            <AtIcon prefixClass='ion' value='ios-arrow-forward' size='20' color='#7f7f7f' />
          </View>
          <View className='list' onClick={this.handleNavigate.bind(this, NAVIGATE_TYPE.ISSUES)}>
            <View className='list_title'>Issues</View>
            <AtIcon prefixClass='ion' value='ios-arrow-forward' size='20' color='#7f7f7f' />
          </View>
          <View className='list' onClick={this.handleNavigate.bind(this, NAVIGATE_TYPE.GISTS)}>
            <View className='list_title'>Gists</View>
            <AtIcon prefixClass='ion' value='ios-arrow-forward' size='20' color='#7f7f7f' />
          </View>
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
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    developerInfo: state.user.developerInfo,
    isFollowed: state.user.isFollowed
  }
}
export default connect(mapStateToProps)(DeveloperInfo)

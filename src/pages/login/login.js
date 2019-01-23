import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtInput, AtButton } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'
import { HTTP_STATUS } from '../../constants/status'
import userAction from '../../actions/user'
import { base64_encode } from '../../utils/base64'

import './login.less'

class Login extends Component {

  config = {
    navigationBarTitleText: 'Login',
    navigationBarBackgroundColor: '#2d8cf0',
    navigationBarTextStyle: 'white'
  }

  constructor(props) {
    super(props)
    this.state = {
      current: 0,
      token: '',
      username: '',
      password: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  handleClicked(value) {
    this.setState({
      current: value
    })
  }

  handleTokenChange (value) {
    this.setState({
      token: value
    })
  }

  handleUsernameChange (value) {
    this.setState({
      username: value
    })
  }

  handlePasswordChange (value) {
    this.setState({
      password: value
    })
  }

  getUserInfo () {
    const { current, token, username, password } = this.state
    let authorization = ''
    if (current === 0) {
      if (token.length === 0) {
        Taro.showToast({
          title: 'Please input token',
          icon: 'none'
        })
      } else {
        authorization = 'token ' + token
      }
    } else {
      if (username.length === 0) {
        Taro.showToast({
          title: 'Please input username',
          icon: 'none'
        })
      } else if (password.length === 0) {
        Taro.showToast({
          title: 'Please input password',
          icon: 'none'
        })
      } else {
        authorization = 'Basic ' + base64_encode(username + ':' + password)
      }
    }

    if (authorization.length !== 0) {
      Taro.setStorageSync('Authorization', authorization)
      Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
      userAction.getUserInfo().then((res)=>{
        Taro.hideLoading()
        if (res.statusCode !== HTTP_STATUS.SUCCESS) {
          Taro.showToast({
            title: res.data.message,
            icon: 'none'
          })
          Taro.setStorageSync('Authorization', '')
        } else {
          Taro.eventCenter.trigger('login_success')
          Taro.setStorageSync('userInfo', res.data)
          Taro.navigateBack()
        }
      })
    }
  }

  handleclickedTokenAddress() {
    Taro.setClipboardData({
      data: 'https://github.com/settings/tokens/new'
    })
  }

  render() {
    const { current } = this.state
    return (
      <View className='content'>
        <View className='logo_bg'>
          <Image mode='aspectFit'
                 className='logo'
                 src={require('../../assets/images/logo.png')}/>
        </View>
        <View className='login_content'>
          <View className='switch_view'>
            <View className={current === 0 ? 'selected_title' : 'normal_title'}
                  onClick={this.handleClicked.bind(this, 0)}>
              Token
            </View>
            <View className={current === 1 ? 'selected_title' : 'normal_title'}
                  onClick={this.handleClicked.bind(this, 1)}>
              Account
            </View>
          </View>
          {current === 0 ?
              <View className='input_view'>
                <AtInput
                  className='input_bar'
                  name='token'
                  title='Token:'
                  type='text'
                  placeholder='please input token'
                  value={this.state.token}
                  onChange={this.handleTokenChange.bind(this)} />
              </View>
              : (<View className='input_view'>
                <AtInput
                  className='input_bar'
                  name='username'
                  title='Username:'
                  type='text'
                  placeholder='please input username'
                  value={this.state.username}
                  onChange={this.handleUsernameChange.bind(this)} />
                <AtInput
                  className='input_bar'
                  name='password'
                  title='Password:'
                  type='password'
                  placeholder='please input password'
                  value={this.state.password}
                  onChange={this.handlePasswordChange.bind(this)} />
              </View>
            )
          }
          <View className='login_button'
                onClick={this.getUserInfo.bind(this)}>
            Login
          </View>
        </View>
        <View className='info_view'>
          <Text className='info_text'>
            1、由于小程序的限制，无法使用OAuth跳转认证，推荐使用Token认证方式；
          </Text>
          <Text className='info_text'>
            2、Token及用户名密码仅用于GitHub Api权限校验，不会被上传服务器；
          </Text>
          <Text className='info_text'>
            3、Token的生成方式请点击复制以下地址至浏览器打开，按照步骤即可生成Token
          </Text>
          <View onClick={this.handleclickedTokenAddress.bind(this)} className='token_address'>
            https://github.com/settings/tokens/new
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}
export default connect(mapStateToProps)(Login)

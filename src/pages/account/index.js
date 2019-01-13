import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtAvatar } from 'taro-ui'
import userAction from '../../actions/user'

import './index.less'

class Index extends Component {

  config = {
    navigationBarTitleText: 'ME',
    navigationBarBackgroundColor: '#2d8cf0',
    navigationBarTextStyle: 'white'
  }

  constructor(props) {
    super(props)
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentDidMount() {
    userAction.getUserInfo()
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='content'>
        <Image className='account_bg' src={require('../../assets/account_bg.png')}/>
        <View className='user_info'>
          <AtAvatar className='avatar' circle image={this.props.userInfo.avatar_url} />
          <Text className='username'>{this.props.userInfo.name}</Text>
        </View>
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

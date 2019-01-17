import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'

import './login.less'

class Login extends Component {

  config = {
    navigationBarTitleText: 'Login'
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}
export default connect(mapStateToProps)(Login)

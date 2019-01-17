import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'

import './login.less'

class IssueList extends Component {

  config = {
    navigationBarTitleText: 'Issues'
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
export default connect(mapStateToProps)(IssueList)

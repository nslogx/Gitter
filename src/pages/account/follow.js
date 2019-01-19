import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import userAction from '../../actions/user'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'
import FollowItem from '../../components/account/followItem'

import './follow.less'

class Follow extends Component {

  config = {
    enablePullDownRefresh: true
  }

  constructor(props) {
    super(props)
    this.state = {
      url: ''
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount() {
    let params = this.$router.params
    let type = params.type
    let url = ''
    let title = ''
    if (type === 'followers') {
      // Followers
      url = '/user/followers'
      title = 'Followers'
    } else if (type === 'following') {
      // Following
      url = '/user/following'
      title = 'Following'
    }

    Taro.setNavigationBarTitle({
      title: title
    })

    this.setState({
      url: url
    })
  }

  componentDidMount() {
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
    let params = {
      url: this.state.url
    }
    userAction.followListRefresh(params).then(()=>{
      Taro.hideLoading()
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  handleClickedItem(item) {
    Taro.navigateTo({
      url: '/pages/account/developerInfo?username=' + item.login
    })
  }

  render () {
    const { followList } = this.props
    const itemList = followList.map((item, index) => {
      return (
        <View onClick={this.handleClickedItem.bind(this, item)} key={index}>
          <FollowItem item={item} />
        </View>
      )
    })
    return (
      <View className='content'>
        {itemList}
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    followList: state.user.followList
  }
}
export default connect(mapStateToProps)(Follow)

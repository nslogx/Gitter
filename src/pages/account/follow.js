import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'
import FollowItem from '../../components/account/followItem'

import './follow.less'
import api from "../../service/api";

class Follow extends Component {

  config = {
    enablePullDownRefresh: true
  }

  constructor(props) {
    super(props)
    this.state = {
      url: '',
      page: 1,
      dataList: []
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount() {
    let params = this.$router.params
    let type = params.type
    let username = params.username
    let url = ''
    let title = ''
    if (type === 'followers') {
      // Followers
      url = '/user/followers'
      if (username) {
        url = '/users/' + username + '/followers'
      }
      title = 'Followers'
    } else if (type === 'following') {
      // Following
      url = '/user/following'
      if (username) {
        url = '/users/' + username + '/following'
      }
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
    this.getDataist()
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  handleClickedItem(item) {
    Taro.navigateTo({
      url: '/pages/account/developerInfo?username=' + item.login
    })
  }

  onPullDownRefresh() {
    let that = this
    this.setState({
      page: 1
    }, ()=>{
      that.getDataist()
    })
  }

  onReachBottom() {
    let that = this
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
    const { page } = this.state
    this.setState({
      page: page + 1
    }, ()=>{
      that.getDataist()
    })
  }

  getDataist() {
    let that = this
    const { url, page, dataList } = this.state
    let params = {
      page: page,
      per_page: GLOBAL_CONFIG.PER_PAGE
    }
    api.get(url, params).then((res)=>{
      if (page === 1) {
        that.setState({
          dataList: res.data
        })
      } else {
        that.setState({
          dataList: dataList.concat(res.data)
        })
      }
      Taro.stopPullDownRefresh()
      Taro.hideLoading()
    })
  }

  render () {
    const { dataList } = this.state
    const itemList = dataList.map((item, index) => {
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

export default Follow

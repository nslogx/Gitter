import Taro, { Component } from '@tarojs/taro'
import {Image, View} from '@tarojs/components'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'
import { hasLogin } from '../../utils/common'
import { HTTP_STATUS } from '../../constants/status'
import ActivityItem from '../../components/activity/activityItem'
import api from '../../service/api'

import './index.less'

class Index extends Component {

  config = {
    navigationBarTitleText: 'Activity',
    enablePullDownRefresh: true
  }

  constructor(props) {
    super(props)
    this.state = {
      list: [],
      page: 1
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount() {
  }

  componentDidMount() {
    Taro.eventCenter.on('login_success', (res)=>{
      Taro.startPullDownRefresh()
    })
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
    this.getActivityList()

    if (!hasLogin()) {
      Taro.showModal({
        content: 'Login to view yours activity?',
        showCancel: true,
        cancelText: 'No',
        cancelColor: '#7f7f7f',
        confirmText: 'Yeah',
        confirmColor: '#2d8cf0',
        success(res) {
          if (res.confirm) {
            Taro.navigateTo({
              url: '/pages/login/login'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  }

  componentWillUnmount () {
  }

  componentDidShow () { }

  componentDidHide () { }

  onPullDownRefresh() {
    let that = this
    this.setState({
      page: 1
    }, ()=>{
      that.getActivityList()
    })
  }

  onReachBottom() {
    let that = this
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
    const { page } = this.state
    this.setState({
      page: page + 1
    }, ()=>{
      that.getActivityList()
    })
  }

  getActivityList() {
    const { page, list } = this.state
    let url = '/events'
    let that = this
    if (hasLogin()) {
      let userInfo =  Taro.getStorageSync('userInfo')
      url = '/users/' + userInfo.login + '/received_events'
    }
    let params = {
      per_page: GLOBAL_CONFIG.PER_PAGE,
      page: page
    }
    api.get(url, params).then((res)=>{
      if (res.statusCode === HTTP_STATUS.SUCCESS) {
        if (page === 1) {
          that.setState({
            list: res.data
          })
        } else {
          that.setState({
            list: list.concat(res.data)
          })
        }
      } else {
        Taro.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    Taro.stopPullDownRefresh()
    Taro.hideLoading()
    })
  }

  render () {
    const { list } = this.state
    return (
      <View className='content'>
        {
          list.map((item, index)=>{
            return (
              <View key={index} className='list_view'>
                <ActivityItem item={item} />
              </View>
            )
          })
        }
      </View>
    )
  }
}

export default Index

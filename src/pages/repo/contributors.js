import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'
import { REFRESH_STATUS } from '../../constants/status'
import FollowItem from '../../components/account/followItem'
import Empty from '../../components/index/empty'
import LoadMore from '../../components/common/loadMore'

import api from '../../service/api'

import './contentList.less'

class Contributors extends Component {

  config = {
    navigationBarTitleText: 'Contributors'
  }

  constructor(props) {
    super(props)
    this.state = {
      url: null,
      page: 1,
      dataList: [],
      refresh_status: REFRESH_STATUS.NORMAL
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount() {
    let params = this.$router.params
    this.setState({
      url: params.url,
    })
  }

  componentDidMount() {
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
    this.getContributors()
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onPullDownRefresh() {
    let that = this
    this.setState({
      page: 1
    }, ()=>{
      that.getContributors()
    })
  }

  onReachBottom() {
    const { page, refresh_status } = this.state
    if (refresh_status !== REFRESH_STATUS.NO_MORE_DATA) {
      let that = this
      this.setState({
        page: page + 1
      }, ()=>{
        that.getContributors()
      })
    }
  }

  getContributors() {
    let that = this
    const { url, page, dataList } = this.state

    if (page !== 1) {
      that.setState({
        refresh_status: REFRESH_STATUS.REFRESHING
      })
    }

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
      let status = res.data.length < GLOBAL_CONFIG.PER_PAGE ? REFRESH_STATUS.NO_MORE_DATA : REFRESH_STATUS.NORMAL
      that.setState({
        refresh_status: status
      })
      Taro.stopPullDownRefresh()
      Taro.hideLoading()
    })
  }

  handleClickedItem(item) {
    Taro.navigateTo({
      url: '/pages/account/developerInfo?username=' + item.login
    })
  }

  render () {
    const { dataList, refresh_status } = this.state
    return (
      <View className='content'>
        {
          dataList.length > 0 ? (
            dataList.map((item, index)=>{
              return (
                <View key={index} onClick={this.handleClickedItem.bind(this, item)}>
                  <FollowItem item={item} />
                </View>
              )
            })
          ) : <Empty />
        }
        <LoadMore status={refresh_status} />
      </View>
    )
  }
}

export default Contributors

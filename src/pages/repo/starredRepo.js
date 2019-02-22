import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'
import { REFRESH_STATUS } from '../../constants/status'
import RepoItem from '../../components/account/repoItem'
import Empty from '../../components/index/empty'
import LoadMore from '../../components/common/loadMore'

import './starredRepo.less'
import api from "../../service/api";

class StarredRepo extends Component {

  config = {
    navigationBarTitleText: 'Starred Repos',
    enablePullDownRefresh: true
  }

  constructor(props) {
    super(props)
    this.state = {
      url: '',
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
    let url = '/user/starred'
    if (params.username) {
      url = '/users/' + params.username + '/starred'
    }
    this.setState({
      url: url
    })
  }

  componentDidMount() {
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
    this.getRepoList()
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onPullDownRefresh() {
    let that = this
    this.setState({
      page: 1
    }, ()=>{
      that.getRepoList()
    })
  }

  onReachBottom() {
    const { page, refresh_status } = this.state
    if (refresh_status !== REFRESH_STATUS.NO_MORE_DATA) {
      let that = this
      this.setState({
        page: page + 1
      }, ()=>{
        that.getRepoList()
      })
    }
  }

  getRepoList() {
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
    let url = '/pages/repo/repo?url=' + encodeURI(item.url)
    Taro.navigateTo({
      url: url
    })
  }

  render () {
    const { dataList, refresh_status } = this.state
    const itemList = dataList.map((item, index) => {
      return (
        <View onClick={this.handleClickedItem.bind(this, item)} key={index}>
          <RepoItem item={item} />
        </View>
      )
    })
    return (
      <View className='content'>
        {dataList.length > 0 ? itemList : <Empty />}
        <LoadMore status={refresh_status} />
      </View>
    )
  }
}

export default StarredRepo

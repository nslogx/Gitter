import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'

import RepoItem from '../../components/account/repoItem'
import Empty from '../../components/index/empty'
import LoadMore from '../../components/common/loadMore'
import { REFRESH_STATUS } from '../../constants/status'

import './repoList.less'
import api from "../../service/api";

class RepoList extends Component {

  config = {
    navigationBarTitleText: 'Repos',
    enablePullDownRefresh: true,
  }

  constructor(props) {
    super(props)
    this.state = {
      url: '',
      page: 1,
      repos: [],
      refresh_status: REFRESH_STATUS.NORMAL
    }
  }

  componentWillReceiveProps (nextProps) {
  }

  componentWillMount() {
    this.setState({
      url: decodeURI(this.$router.params.url)
    })
  }

  componentDidMount() {
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
    this.getRepoList()
  }

  onPullDownRefresh() {
    let that = this
    this.setState({
      page: 1
    }, ()=>{
      that.getRepoList()
    })
  }

  onReachBottom() {
    let that = this
    const { page, refresh_status } = this.state
    if (refresh_status !== REFRESH_STATUS.NO_MORE_DATA) {
      this.setState({
        page: page + 1
      }, ()=>{
        that.getRepoList()
      })
    }
  }

  getRepoList() {
    let that = this
    const { url, page, repos } = this.state

    if (page !== 1) {
      that.setState({
        refresh_status: REFRESH_STATUS.REFRESHING
      })
    }

    let params = {
      page: page,
      per_page: GLOBAL_CONFIG.PER_PAGE,
      type: 'owner',
      sort: 'updated'
    }
    api.get(url, params).then((res)=>{
      if (page === 1) {
        that.setState({
          repos: res.data
        })
      } else {
        that.setState({
          repos: repos.concat(res.data),
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

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    const { repos, refresh_status } = this.state
    const repoList = repos.map((item, index) => {
      return (
        <View onClick={this.handleClickedItem.bind(this, item)} key={index}>
          <RepoItem item={item} />
          </View>
      )
    })
    return (
      <View className='content'>
        {repos.length > 0 ? repoList : <Empty />}
        <LoadMore status={refresh_status} />
      </View>
    )
  }
}

export default RepoList

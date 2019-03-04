import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'
import { REFRESH_STATUS } from '../../constants/status'

import IssueList from '../../components/account/issueList'
import Segment from '../../components/index/segment'
import Empty from '../../components/index/empty'
import LoadMore from '../../components/common/loadMore'

import api from '../../service/api'

import './issues.less'

class Issues extends Component {

  config = {
    navigationBarTitleText: 'Issues',
    enablePullDownRefresh: true
  }

  constructor(props) {
    super(props)
    this.state = {
      current: 0,
      url: null,
      isUser: false,
      repo: null,
      fixed: false,
      openList: [],
      closedList: [],
      open_page: 1,
      close_page: 1,
      open_status: REFRESH_STATUS.NORMAL,
      close_status: REFRESH_STATUS.NORMAL,
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount() {
    let params = this.$router.params
    this.setState({
      url: params.url,
      isUser: params.url.indexOf('user') !== -1,
      repo: params.repo
    })
  }

  componentDidMount() {
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
    this.getOpenIssuesList()
    this.getClosedIssuesList()
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onPageScroll(obj) {
    const { fixed } = this.state
    if (obj.scrollTop > 0) {
      if (!fixed) {
        this.setState({
          fixed: true
        })
      }
    } else {
      this.setState({
        fixed: false
      })
    }
  }

  onPullDownRefresh() {
    let that = this
    const { current } = this.state
    if (current === 0) {
      this.setState({
        open_page: 1
      }, ()=>{
        that.getOpenIssuesList()
      })
    } else {
      this.setState({
        close_page: 1
      }, ()=>{
        that.getClosedIssuesList()
      })
    }
  }

  onReachBottom() {
    let that = this
    const { current, open_page, close_page, open_status, close_status } = this.state
    if (current === 0) {
      if (open_status !== REFRESH_STATUS.NO_MORE_DATA) {
        this.setState({
          open_page: open_page + 1
        }, ()=>{
          that.getOpenIssuesList()
        })
      }
    } else {
      if (close_status !== REFRESH_STATUS.NO_MORE_DATA) {
        this.setState({
          close_page: close_page + 1
        }, ()=>{
          that.getClosedIssuesList()
        })
      }
    }
  }

  getOpenIssuesList() {
    let that = this
    const { url, openList, open_page } = this.state
    if (open_page !== 1) {
      that.setState({
        open_status: REFRESH_STATUS.REFRESHING
      })
    }
    let params = {
      filter: 'all',
      page: open_page,
      per_page: GLOBAL_CONFIG.PER_PAGE
    }
    api.get(url, params).then((res)=>{
      if (open_page === 1) {
        that.setState({
          openList: res.data
        })
      } else {
        that.setState({
          openList: openList.concat(res.data)
        })
      }
      let status = res.data.length < GLOBAL_CONFIG.PER_PAGE ? REFRESH_STATUS.NO_MORE_DATA : REFRESH_STATUS.NORMAL
      that.setState({
        open_status: status
      })
      Taro.hideLoading()
      Taro.stopPullDownRefresh()
    })
  }

  getClosedIssuesList() {
    let that = this
    const { url, closedList, close_page } = this.state
    if (close_page !== 1) {
      that.setState({
        close_status: REFRESH_STATUS.REFRESHING
      })
    }
    let params = {
      filter: 'all',
      page: close_page,
      state: 'closed',
      per_page: GLOBAL_CONFIG.PER_PAGE
    }
    api.get(url, params).then((res)=>{
      if (close_page === 1) {
        that.setState({
          closedList: res.data
        })
      } else {
        that.setState({
          closedList: closedList.concat(res.data)
        })
      }
      let status = res.data.length < GLOBAL_CONFIG.PER_PAGE ? REFRESH_STATUS.NO_MORE_DATA : REFRESH_STATUS.NORMAL
      that.setState({
        close_status: status
      })
      Taro.hideLoading()
      Taro.stopPullDownRefresh()
    })
  }

  addIssue() {
    Taro.navigateTo({
      url: '/pages/repo/addIssue?repo=' + this.state.repo
    })
  }

  onTabChange(index) {
    this.setState({
      current: index
    })
  }

  render () {
    const { openList, closedList, isUser, fixed, current, open_status, close_status } = this.state
    const count = current === 0 ? openList.length : closedList.length
    return (
      <View className='content'>
        <View className={fixed ? 'segment-fixed' : ''}>
          <Segment tabList={['OPEN', 'CLOSED']}
                   current={current}
                   showAction={false}
                   onTabChange={this.onTabChange}
          />
        </View>
        {
          fixed &&
          <View className='segment-placeholder' />
        }
        {count === 0 ?
          <Empty /> : (
            current === 0 ? <IssueList itemList={openList} /> : <IssueList itemList={closedList} />
        )}
        <LoadMore status={current === 0 ? open_status : close_status} />
        {
          !isUser &&
          <View className='add_issue' onClick={this.addIssue.bind(this)}>
            <AtIcon prefixClass='ion'
                    value='ios-add'
                    size='40'
                    color='#fff' />
          </View>
        }
      </View>
    )
  }
}

export default Issues

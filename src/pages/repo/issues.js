import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtIcon } from 'taro-ui'
import IssueList from '../../components/account/issueList'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'
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
      openList: [],
      closedList: [],
      url: null,
      isRefresh: false,
      page: 1,
      isUser: false,
      repo: null
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount() {
    let params = this.$router.params
    this.setState({
      url: params.url,
      isUser: params.url.indexOf('user') !== 1,
      repo: params.repo
    })
  }

  componentDidMount() {
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
    this.getIssuesList()
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onPullDownRefresh() {
    let that = this
    const { page } = this.state
    this.setState({
      isRefresh: true,
      page: 1
    }, ()=>{
      that.getIssuesList()
    })
  }

  onReachBottom() {
    let that = this
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
    const { page } = this.state
    this.setState({
      isRefresh: false,
      page: page + 1
    }, ()=>{
      that.getIssuesList()
    })
  }

  handleClick (value) {
    let that = this
    const { openList, closedList } = this.state
    this.setState({
      current: value
    }, ()=>{
      if ((that.state.current === 0 && openList.length === 0) ||
        (that.state.current === 1 && closedList.length === 0)) {
        that.setState({
          isRefresh: true
        }, ()=>{
          Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
          that.getIssuesList()
        })
      }
    })
  }

  getIssuesList() {
    let that = this
    const { url, current, openList, closedList, isRefresh, page } = this.state
    let params = {
      filter: 'all',
      page: page
    }
    if (current === 1) {
      params = {
        state: 'closed',
        filter: 'all',
        page: page
      }
    }
    api.get(url, params).then((res)=>{
      if (current === 0) {
        if (isRefresh) {
          that.setState({
            openList: res.data
          })
        } else {
          that.setState({
            openList: openList.concat(res.data)
          })
        }
      } else {
        if (isRefresh) {
          that.setState({
            closedList: res.data
          })
        } else {
          that.setState({
            closedList: closedList.concat(res.data)
          })
        }
      }
      Taro.hideLoading()
      Taro.stopPullDownRefresh()
    })
  }

  addIssue() {
    Taro.navigateTo({
      url: '/pages/repo/addIssue?repo=' + this.state.repo
    })
  }

  render () {
    const { openList, closedList, isUser } = this.state
    return (
      <View className='content'>
        <AtTabs
          swipeable={false}
          animated={true}
          current={this.state.current}
          tabList={[
            { title: 'open' },
            { title: 'closed' }
          ]}
          onClick={this.handleClick.bind(this)} >
          <AtTabsPane current={this.state.current} index={0}>
            <IssueList itemList={openList} />
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1}>
            <IssueList itemList={closedList} />
          </AtTabsPane>
        </AtTabs>
        {
          isUser &&
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

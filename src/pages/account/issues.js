import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
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
      page: 1
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount() {
    let params = this.$router.params
    this.setState({
      url: params.url
    })
  }

  componentDidMount() {
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
    this.getIssuesList()


    // let params = {
      // body: '**来自GitHub小程序客户端：**\n\n![image](https://user-images.githubusercontent.com/8692455/51429898-b159f400-1c4e-11e9-91a1-59cd1fab5042.png)'
    // }
    // api.post('https://api.github.com/repos/huangjianke/Gitter/issues/1/comments', params)
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
      console.log('res',res)
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

  render () {
    const { openList, closedList } = this.state
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
      </View>
    )
  }
}

export default Issues

import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import {AtTabs, AtSearchBar, AtTabsPane} from 'taro-ui'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'

import RepoItem from '../../components/account/repoItem'
import FollowItem from '../../components/account/followItem'

import './index.less'
import api from "../../service/api";
import ItemList from "../index";

class Index extends Component {

  config = {
    navigationBarTitleText: 'Search'
  }

  constructor(props) {
    super(props)
    this.state = {
      value: '',
      current: 0,
      repos: [],
      users: [],
      repo_page: 1,
      user_page: 1
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentDidMount() {
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onReachBottom() {
    let that = this
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
    const { repo_page, user_page, current } = this.state
    if (current === 0) {
      this.setState({
        repo_page: repo_page + 1
      }, ()=>{
        that.searchRepo()
      })
    } else {
      this.setState({
        user_page: user_page + 1
      }, ()=>{
        that.searchUsers()
      })
    }
  }

  searchRepo() {
    let that = this
    let url = '/search/repositories'
    const { repo_page, repos, value } = this.state
    let params = {
      page: repo_page,
      per_page: GLOBAL_CONFIG.PER_PAGE,
      q: value
    }
    api.get(url, params).then((res)=>{
      if (repo_page === 1) {
        that.setState({
          repos: res.data.items
        })
      } else {
        that.setState({
          repos: repos.concat(res.data.items)
        })
      }
      Taro.hideLoading()
    })
  }

  searchUsers() {
    let that = this
    let url = '/search/users'
    const { user_page, users, value } = this.state
    let params = {
      page: user_page,
      per_page: GLOBAL_CONFIG.PER_PAGE,
      q: value
    }
    api.get(url, params).then((res)=>{
      if (user_page === 1) {
        that.setState({
          users: res.data.items
        })
      } else {
        that.setState({
          users: users.concat(res.data.items)
        })
      }
      Taro.hideLoading()
    })
  }

  onChange (value) {
    this.setState({
      value: value
    })
  }

  handleClick (value) {
    this.setState({
      current: value
    })
  }

  onActionClick () {
    let that = this
    this.setState({
      user_page: 1,
      repo_page: 1
    }, ()=>{
      Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
      that.searchRepo()
      that.searchUsers()
    })
  }

  handleClickedRepoItem(item) {
    let url = '/pages/repo/repo?url=' + decodeURI(item.url)
    Taro.navigateTo({
      url: url
    })
  }

  handleClickedUserItem(item) {
    Taro.navigateTo({
      url: '/pages/account/developerInfo?username=' + item.login
    })
  }

  render () {
    const { current, repos, users } = this.state
    return (
      <View className='content'>
        <AtSearchBar
          value={this.state.value}
          placeholder='搜索'
          actionName='Search'
          showActionButton
          onChange={this.onChange.bind(this)}
          onActionClick={this.onActionClick.bind(this)}
          onConfirm={this.onActionClick.bind(this)}
        />
        {
          (repos.length > 0 || users.length > 0) && (
            <AtTabs
              swipeable={false}
              animated={true}
              current={this.state.current}
              tabList={[
                { title: 'Repositories' },
                { title: 'Developers' }
              ]}
              onClick={this.handleClick.bind(this)} >
              <AtTabsPane current={this.state.current} index={0}>
                {
                  repos.map((item, index) => {
                    return (
                      <View onClick={this.handleClickedRepoItem.bind(this, item)} key={index}>
                        <RepoItem item={item} />
                      </View>
                    )
                  })
                }
              </AtTabsPane>
              <AtTabsPane current={this.state.current} index={1}>
                {
                  users.map((item, index) => {
                    return (
                      <View onClick={this.handleClickedUserItem.bind(this, item)} key={index}>
                        <FollowItem item={item} />
                      </View>
                    )
                  })
                }
              </AtTabsPane>
            </AtTabs>
          )
        }
      </View>
    )
  }
}

export default Index

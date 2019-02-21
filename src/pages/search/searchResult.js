import Taro, {Component} from '@tarojs/taro'
import {Text, View} from '@tarojs/components'
import {GLOBAL_CONFIG} from '../../constants/globalConfig'

import RepoItem from '../../components/account/repoItem'
import FollowItem from '../../components/account/followItem'
import Segment from '../../components/index/segment'
import Empty from '../../components/index/empty'

import './searchResult.less'
import api from "../../service/api";

class SearchResult extends Component {

  config = {
    enablePullDownRefresh: true
  }

  constructor(props) {
    super(props)
    this.state = {
      value: '',
      current: 0,
      fixed: false,
      repos: [],
      users: [],
      repo_page: 1,
      user_page: 1,
      repo_sort: 'Best Match',
      user_sort: 'Best Match',
      repo_sort_value: '',
      user_sort_value: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount() {
    let params = this.$router.params
    this.setState({
      value: decodeURI(params.value),
    })
    Taro.setNavigationBarTitle({
      title: params.value
    })
  }

  componentDidMount() {
    let that = this
    this.setState({
      user_page: 1,
      repo_page: 1
    }, () => {
      Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
      that.searchRepo()
      that.searchUsers()
    })
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  onPullDownRefresh() {
    this.refresh()
  }

  refresh() {
    let that = this
    const {current} = this.state
    if (current === 0) {
      this.setState({
        repo_page: 1
      }, () => {
        that.searchRepo()
      })
    } else {
      this.setState({
        user_page: 1
      }, () => {
        that.searchUsers()
      })
    }
  }

  onReachBottom() {
    let that = this
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
    const {repo_page, user_page, current} = this.state
    if (current === 0) {
      this.setState({
        repo_page: repo_page + 1
      }, () => {
        that.searchRepo()
      })
    } else {
      this.setState({
        user_page: user_page + 1
      }, () => {
        that.searchUsers()
      })
    }
  }

  searchRepo() {
    let that = this
    let url = '/search/repositories'
    const {repo_page, repos, value, repo_sort_value} = this.state
    let params = {
      page: repo_page,
      per_page: GLOBAL_CONFIG.PER_PAGE,
      q: value,
      sort: repo_sort_value
    }
    api.get(url, params).then((res) => {
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
      Taro.stopPullDownRefresh()
    })
  }

  searchUsers() {
    let that = this
    let url = '/search/users'
    const {user_page, users, value, user_sort_value} = this.state
    let params = {
      page: user_page,
      per_page: GLOBAL_CONFIG.PER_PAGE,
      q: value,
      sort: user_sort_value
    }
    api.get(url, params).then((res) => {
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
      Taro.stopPullDownRefresh()
    })
  }

  handleClickedRepoItem(item) {
    let url = '/pages/repo/repo?url=' + encodeURI(item.url)
    Taro.navigateTo({
      url: url
    })
  }

  handleClickedUserItem(item) {
    Taro.navigateTo({
      url: '/pages/account/developerInfo?username=' + item.login
    })
  }

  onPageScroll(obj) {
    const {fixed} = this.state
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

  onTabChange(index) {
    this.setState({
      current: index
    })
  }

  onClickedFilter() {
    const {current} = this.state
    let itemList = null
    if (current === 0) {
      itemList = ['Best Match', 'Most Stars', 'Most Forks']
    } else {
      itemList = ['Best Match', 'Most Followers', 'Most Repositories', 'Recently Joined']
    }

    let that = this
    Taro.showActionSheet({
      itemList,
      success(res) {
        let value = null
        if (current === 0) {
          if (res.tapIndex === 0) {
            value = ''
          } else if (res.tapIndex === 1) {
            value = 'stars'
          } else if (res.tapIndex === 2) {
            value = 'forks'
          }
          that.setState({
            repo_sort: itemList[res.tapIndex],
            repo_sort_value: value
          }, ()=>{
            Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
            that.refresh()
          })
        } else {
          if (res.tapIndex === 0) {
            value = ''
          } else if (res.tapIndex === 1) {
            value = 'followers'
          } else if (res.tapIndex === 2) {
            value = 'repositories'
          } else if (res.tapIndex === 3) {
            value = 'joined'
          }
          that.setState({
            user_sort: itemList[res.tapIndex],
            user_sort_value: value
          }, ()=>{
            Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
            that.refresh()
          })
        }
      }
    })
  }

  render() {
    const {current, repos, users, fixed, repo_sort, user_sort} = this.state
    let list = null
    let count = current === 0 ? repos.length : users.length
    switch (current) {
      case 0: {
        list = repos.map((item, index) => {
          return (
            <View onClick={this.handleClickedRepoItem.bind(this, item)} key={index}>
              <RepoItem item={item}/>
            </View>
          )
        })
      }
        break
      case 1: {
        list = users.map((item, index) => {
          return (
            <View onClick={this.handleClickedUserItem.bind(this, item)} key={index}>
              <FollowItem item={item}/>
            </View>
          )
        })
      }
        break
    }
    return (
      <View className='content'>
        <View className={fixed ? 'search-segment-fixed' : ''}>
          <Segment current={current}
                   showAction={false}
                   onTabChange={this.onTabChange}
          />
        </View>
        {
          fixed &&
          <View className='search-segment-placeholder'/>
        }
        {count === 0 ? <Empty/> : list}
        {
          count > 0 &&
          <View className='filter' onClick={this.onClickedFilter.bind(this)}>
            <Text className='filter-title'>{current === 0 ? repo_sort : user_sort}</Text>
          </View>
        }
      </View>
    )
  }
}

export default SearchResult

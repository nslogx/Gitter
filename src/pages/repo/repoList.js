import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'

import RepoItem from '../../components/account/repoItem'

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
      repos: []
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
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
    const { page } = this.state
    this.setState({
      page: page + 1
    }, ()=>{
      that.getRepoList()
    })
  }

  getRepoList() {
    let that = this
    const { url, page, repos } = this.state
    let params = {
      page: page,
      per_page: GLOBAL_CONFIG.PER_PAGE
    }
    api.get(url, params).then((res)=>{
      if (page === 1) {
        that.setState({
          repos: res.data
        })
      } else {
        that.setState({
          repos: repos.concat(res.data)
        })
      }
      Taro.stopPullDownRefresh()
      Taro.hideLoading()
    })
  }

  handleClickedItem(item) {
    let url = '/pages/repo/repo?url=' + decodeURI(item.url)
    Taro.navigateTo({
      url: url
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    const { repos } = this.state
    const repoList = repos.map((item, index) => {
      return (
        <View onClick={this.handleClickedItem.bind(this, item)} key={index}>
          <RepoItem item={item} />
          </View>
      )
    })
    return (
      <View className='content'>
        {repoList}
      </View>
    )
  }
}

export default RepoList

import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'
import RepoItem from '../../components/account/repoItem'

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
      dataList: []
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
    const { url, page, dataList } = this.state
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

  render () {
    const { dataList } = this.state
    const itemList = dataList.map((item, index) => {
      return (
        <View onClick={this.handleClickedItem.bind(this, item)} key={index}>
          <RepoItem item={item} />
        </View>
      )
    })
    return (
      <View className='content'>
        {itemList}
      </View>
    )
  }
}

export default StarredRepo

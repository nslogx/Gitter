import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'
import FollowItem from '../../components/account/followItem'

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
      dataList: []
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
    let that = this
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
    const { page } = this.state
    this.setState({
      page: page + 1
    }, ()=>{
      that.getContributors()
    })
  }

  getContributors() {
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
    Taro.navigateTo({
      url: '/pages/account/developerInfo?username=' + item.login
    })
  }

  render () {
    const { dataList } = this.state
    return (
      <View className='content'>
        {
          dataList.map((item, index) => {
            return (
              <View key={index} onClick={this.handleClickedItem.bind(this, item)}>
                <FollowItem item={item} />
              </View>
            )
          })
        }
      </View>
    )
  }
}

export default Contributors

import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'
import repos from '../../actions/repos'

import RepoItem from '../../components/account/repoItem'

import './repos.less'

class Repos extends Component {

  config = {
    navigationBarTitleText: 'REPOS',
    enablePullDownRefresh: true,
  }

  constructor(props) {
    super(props)
    this.state = {
      url: '',
      page: 1
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
    Taro.startPullDownRefresh()
  }

  onPullDownRefresh() {
    this.setState({
      page: 1
    }, () => {
      let data = {
        per_page: GLOBAL_CONFIG.PER_PAGE,
        page: this.state.page
      }
      let params = {
        data: data,
        url: this.state.url
      }
      repos.reposListRefresh(params)
        .then(()=>{
        Taro.stopPullDownRefresh()
      })
    })
  }

  onReachBottom() {
    const { page } = this.state
    this.setState({
      page: page + 1
    }, () => {
      Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
      let data = {
        per_page: GLOBAL_CONFIG.PER_PAGE,
        page: this.state.page
      }
      let params = {
        data: data,
        url: this.state.url
      }
      repos.reposListLoadMore(params)
        .then(()=>{
          Taro.stopPullDownRefresh()
          Taro.hideLoading()
        })
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    const { repos } = this.props
    const repoList = repos.map((item, index) => {
      return <RepoItem item={item} key={index} />
    })
    return (
      <View className='content'>
        {repoList}
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    repos: state.repos.repos
  }
}
export default connect(mapStateToProps)(Repos)

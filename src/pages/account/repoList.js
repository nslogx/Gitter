import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'
import reposAction from '../../actions/repos'

import RepoItem from '../../components/account/repoItem'

import './repos.less'

class RepoList extends Component {

  config = {
    navigationBarTitleText: 'Repos',
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
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
    this.refresh()
  }

  onPullDownRefresh() {
    this.refresh()
  }

  refresh() {
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
      console.log('params', params)
      reposAction.reposListRefresh(params)
        .then(()=>{
          Taro.stopPullDownRefresh()
          Taro.hideLoading()
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
      reposAction.reposListLoadMore(params)
        .then(()=>{
          Taro.stopPullDownRefresh()
          Taro.hideLoading()
        })
    })
  }

  handleClickedItem(item) {
    Taro.navigateTo({
      url: '/pages/account/repo?url=' + item.url
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    const { repos } = this.props
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

const mapStateToProps = (state, ownProps) => {
  return {
    repos: state.repos.repos
  }
}
export default connect(mapStateToProps)(RepoList)

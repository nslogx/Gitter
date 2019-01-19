import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import reposAction  from '../../actions/repos'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'
import RepoItem from '../../components/account/repoItem'

import './starredRepo.less'

class StarredRepo extends Component {

  config = {
    navigationBarTitleText: 'Starred Repo',
    enablePullDownRefresh: true
  }

  constructor(props) {
    super(props)
    this.state = {
      url: ''
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount() {
    let params = this.$router.params
    let url = '/user/starred'
    if (params.username) {
      url = '/user/' + params.username + '/starred'
    }
    this.setState({
      url: url
    })
  }

  componentDidMount() {
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
    let params = {
      url: this.state.url
    }
    reposAction.starredRepoRefresh(params).then(()=>{
      Taro.hideLoading()
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  handleClickedItem(item) {
    let url = '/pages/account/repo?url=' + decodeURI(item.url)
    Taro.navigateTo({
      url: url
    })
  }

  render () {
    const { followList } = this.props
    const itemList = followList.map((item, index) => {
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

const mapStateToProps = (state, ownProps) => {
  return {
    followList: state.user.followList
  }
}
export default connect(mapStateToProps)(StarredRepo)

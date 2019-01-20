import Taro, { Component } from '@tarojs/taro'
import {View, Text, Button} from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'
import { AtIcon } from 'taro-ui'
import reposAction from '../../actions/repos'
import { base64_decode } from '../../utils/base64'
import { NAVIGATE_TYPE } from '../../constants/navigateType'

import './repo.less'

class Repo extends Component {

  config = {
    navigationBarTitleText: '',
    enablePullDownRefresh: true,
    navigationBarBackgroundColor: '#2d8cf0',
    navigationBarTextStyle: 'white',
    usingComponents: {
      wemark: '../../components/wemark/wemark'
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      url: ''
    }
  }

  componentWillReceiveProps (nextProps) {
  }

  componentWillMount() {
    let params = this.$router.params
    console.log(params)
    this.setState({
      url: encodeURI(params.url)
    })
  }

  componentDidMount() {
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
    this.getRepo()
  }


  onPullDownRefresh() {
    this.getRepo()
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onPageScroll(e) {
    let title = ''
    const { repo } = this.props
    if (e.scrollTop > 0) {
      title = repo.data.name
    }
    Taro.setNavigationBarTitle({
      title: title
    })
  }

  onShareAppMessage(obj) {
    const { repo } = this.props
    const { url } = this.state
    let path = '/pages/account/repo?url=' + decodeURI(url)
    return {
      title: repo.data.name + '-' +repo.data.description,
      path: path
    }
  }

  getRepo() {
    let params = {
      url: this.state.url
    }
    let that = this
    reposAction.getRepo(params).then(()=>{
      Taro.hideLoading()
      Taro.stopPullDownRefresh()
      that.getReadme()
    })
  }

  getReadme() {
    const { repo } = this.props
    let url = '/repos/' + repo.data.full_name + '/readme'
    let params = {
      url: url
    }
    reposAction.getRepoReadMe(params).then(()=>{
      Taro.hideLoading()
    })
  }


  handleNavigate(type) {
    const { repo } = this.props
    switch (type) {
      case NAVIGATE_TYPE.USER: {
        Taro.navigateTo({
          url: '/pages/account/developerInfo?username=' + repo.data.owner.login
        })
      }
        break
      case NAVIGATE_TYPE.REPO_CONTENT_LIST: {
        Taro.navigateTo({
          url: '/pages/account/contentList?repo=' + repo.data.full_name
        })
      }
        break
      case NAVIGATE_TYPE.ISSUES: {
        let url = '/pages/account/issues?url=/repos/' + repo.data.full_name + '/issues&repo=' + repo.data.full_name
        Taro.navigateTo({
          url: url
        })
      }
        break
      default: {

      }
    }
  }

  render () {
    const { repo } = this.props
    if (!repo.data) return <View />
    let md = ''
    if (repo.readme && repo.readme.content.length > 0) {
      md = base64_decode(repo.readme.content)
    }
    return (
      <View className='content'>
        <View className='repo_bg_view'>
          <Text className='repo_info_title'>{repo.data.name}</Text>
          <Text className='repo_info_desc'>{repo.data.description}</Text>
        </View>
        <View className='repo_number_view'>
          <View className='repo_number_item_view'>
            <View className='repo_number_item'>
              <AtIcon prefixClass='ion' value='ios-eye' size='25' color='#333' />
              <Text className='repo_number_title'>{repo.data.watchers_count}</Text>
            </View>
            <View className='repo_number_item'>
              <AtIcon prefixClass='ion' value='ios-star-outline' size='25' color='#333' />
              <Text className='repo_number_title'>{repo.data.stargazers_count}</Text>
            </View>
            <View className='repo_number_item'>
              <AtIcon prefixClass='ion' value='ios-git-network' size='25' color='#333' />
              <Text className='repo_number_title'>{repo.data.forks_count}</Text>
            </View>
          </View>
          <Button className='share_button' openType='share'>Share</Button>
        </View>
        <View className='repo_info_list_view'>
          <View className='repo_info_list' onClick={this.handleNavigate.bind(this, NAVIGATE_TYPE.USER)}>
            <View className='list_title'>Author</View>
            <View className='list_content'>
              <Text className='list_content_title'>{repo.data.owner.login}</Text>
              <AtIcon prefixClass='ion' value='ios-arrow-forward' size='18' color='#7f7f7f' />
            </View>
          </View>
          <View className='repo_info_list'>
            <View className='list_title'>Branch</View>
            <View className='list_content'>
              <Text className='list_content_title'>{repo.data.default_branch}</Text>
              <AtIcon prefixClass='ion' value='ios-arrow-forward' size='18' color='#7f7f7f' />
            </View>
          </View>
          <View className='repo_info_list' onClick={this.handleNavigate.bind(this, NAVIGATE_TYPE.REPO_CONTENT_LIST)}>
            <View className='list_title'>View Code</View>
            <AtIcon prefixClass='ion' value='ios-arrow-forward' size='18' color='#7f7f7f' />
          </View>
        </View>
        <View className='repo_info_list_view'>
          <View className='repo_info_list' onClick={this.handleNavigate.bind(this, NAVIGATE_TYPE.ISSUES)}>
            <View className='list_title'>Issues</View>
            <View className='list_content'>
              {
                repo.data.open_issues_count > 0 &&
                <View className='tag'>{repo.data.open_issues_count}</View>
              }
              <AtIcon prefixClass='ion' value='ios-arrow-forward' size='18' color='#7f7f7f' />
            </View>
          </View>
          <View className='repo_info_list'>
            <View className='list_title'>Pull Requests</View>
            <AtIcon prefixClass='ion' value='ios-arrow-forward' size='18' color='#7f7f7f' />
          </View>
          <View className='repo_info_list'>
            <View className='list_title'>Contributors</View>
            <AtIcon prefixClass='ion' value='ios-arrow-forward' size='18' color='#7f7f7f' />
          </View>
        </View>
        {
          md.length > 0 &&
          <View className='markdown'>
            <Text className='md_title'>README.md</Text>
            <View className='md'>
              <wemark md={md} link highlight type='wemark' />
            </View>
          </View>
        }
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    repo: state.repos.repo,

  }
}
export default connect(mapStateToProps)(Repo)

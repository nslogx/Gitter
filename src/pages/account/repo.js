import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'
import { AtIcon, AtTag } from 'taro-ui'
import reposAction from '../../actions/repos'
import { base64_decode } from '../../utils/base64'
import { NAVIGATE_TYPE } from '../../constants/navigateType'

import './repo.less'

class Repo extends Component {

  config = {
    navigationBarTitleText: 'Repo',
    enablePullDownRefresh: true,
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
          <View className='repo_info_title_view'>
            <AtIcon prefixClass='ion' value='md-bookmarks' size='25' color='#333' />
            <Text className='repo_info_title'>{repo.data.name}</Text>
          </View>
          <Text className='repo_info_desc'>{repo.data.description}</Text>
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
          <View className='repo_info_list'>
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

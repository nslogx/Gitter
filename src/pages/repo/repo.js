import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Navigator } from '@tarojs/components'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'
import { AtIcon } from 'taro-ui'
import { base64_decode } from '../../utils/base64'
import { hasLogin } from '../../utils/common'
import { HTTP_STATUS } from '../../constants/status'
import { NAVIGATE_TYPE } from '../../constants/navigateType'
import Markdown from '../../components/repo/markdown'
import api from '../../service/api'

import Towxml from '../../components/towxml/main'
const render = new Towxml()

import './repo.less'

class Repo extends Component {

  config = {
    navigationBarTitleText: '',
    enablePullDownRefresh: true,
    navigationBarBackgroundColor: '#2d8cf0',
    navigationBarTextStyle: 'white'
  }

  constructor(props) {
    super(props)
    this.state = {
      url: '',
      repo: null,
      readme: null,
      hasStar: false,
      isShare: false,
      md: null
    }
  }

  componentWillReceiveProps (nextProps) {
  }

  componentWillMount() {
    let params = this.$router.params
    console.log(params)
    this.setState({
      url: encodeURI(params.url),
      isShare: params.share
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
    const { repo } = this.state
    if (e.scrollTop > 0) {
      title = repo.name
    }
    Taro.setNavigationBarTitle({
      title: title
    })
  }

  onShareAppMessage(obj) {
    const { repo } = this.state
    const { url } = this.state
    let path = '/pages/repo/repo?url=' + decodeURI(url) + '&share=true'
    return {
      title: repo.name + ' -- ' +repo.description || 'no description',
      path: path
    }
  }

  getRepo() {
    let that = this
    api.get(this.state.url).then((res)=>{
      console.log(res)
      that.setState({
        repo: res.data
      }, ()=>{
        Taro.hideLoading()
        Taro.stopPullDownRefresh()
        that.getReadme()
        that.checkStarring()
      })
    })
  }

  getReadme() {
    const { repo } = this.state
    let url = '/repos/' + repo.full_name + '/readme'
    let that = this
    api.get(url).then((res)=>{
      that.setState({
        readme: res.data
      }, ()=>{
        that.parseReadme()
      })
    })
  }

  parseReadme() {
    const { readme } = this.state
    this.setState({
      md: base64_decode(readme.content)
    })

    // let url = 'https://gitter-weapp.herokuapp.com/parse'
    // let that = this
    // let params = {
    //   type: 'markdown',
    //   content: base64_decode(readme.content)
    // }
    // api.post(url, params).then((res)=>{
    //   that.setState({
    //     md: res.data
    //   })
    // })
  }

  checkStarring() {
    if (hasLogin()) {
      const { repo } = this.state
      let that = this
      let url = '/user/starred/' + repo.full_name
      api.get(url).then((res)=>{
        that.setState({
          hasStar: res.statusCode === 204
        })
      })
    }
  }

  handleStar() {
    const { hasStar, repo } = this.state
    let url = '/user/starred/' + repo.full_name
    let that = this
    if (hasStar) {
      api.delete(url).then((res)=>{
        repo.stargazers_count -= 1
        if (res.statusCode === 204) {
          that.setState({
            hasStar: false,
            repo: repo
          })
        }
      })
    } else {
      api.put(url).then((res)=>{
        if (res.statusCode === 204) {
          repo.stargazers_count += 1
          that.setState({
            hasStar: true,
            repo: repo
          })
        }
      })
    }
  }

  handleFork() {
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
    const { repo } = this.state
    let that = this
    let url = '/repos/' + repo.full_name + '/forks'
    api.post(url).then((res)=>{
      if (res.statusCode === HTTP_STATUS.SUCCESS) {
        Taro.showToast({
          title: 'Success'
        })
      } else {
        Taro.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
      Taro.hideLoading()
    })
  }

  handleNavigate(type) {
    const { repo } = this.state
    switch (type) {
      case NAVIGATE_TYPE.USER: {
        Taro.navigateTo({
          url: '/pages/account/developerInfo?username=' + repo.owner.login
        })
      }
        break
      case NAVIGATE_TYPE.REPO_CONTENT_LIST: {
        Taro.navigateTo({
          url: '/pages/repo/contentList?repo=' + repo.full_name
        })
      }
        break
      case NAVIGATE_TYPE.ISSUES: {
        let url = '/pages/repo/issues?url=/repos/' + repo.full_name + '/issues&repo=' + repo.full_name
        Taro.navigateTo({
          url: url
        })
      }
        break
      case NAVIGATE_TYPE.REPO_CONTRIBUTORS_LIST: {
        let url = '/pages/repo/contributors?url=/repos/' + repo.full_name + '/contributors'
        Taro.navigateTo({
          url: url
        })
      }
        break
      default: {

      }
    }
  }

  onClickedHome () {
    Taro.reLaunch({
      url: '/pages/index/index'
    })
  }

  render () {
    const { repo, hasStar, isShare, md } = this.state
    if (!repo) return <View />
    return (
      <View className='content'>
        <View className='repo_bg_view'>
          <Text className='repo_info_title'>{repo.name}</Text>
          {
            repo.fork &&
            <View className='fork'>
              <AtIcon prefixClass='ion' value='ios-git-network' size='15' color='#fff' />
              <Navigator url={'/pages/repo/repo?url=' + decodeURI(repo.parent.url)}>
                <Text className='fork_title'>
                  {repo.parent.full_name}
                </Text>
              </Navigator>
            </View>
          }
          <Text className='repo_info_desc'>{repo.description || 'no description'}</Text>
        </View>
        <View className='repo_number_view'>
          <View className='repo_number_item_view'>
            <View className='repo_number_item'>
              <AtIcon prefixClass='ion' value='ios-eye' size='25' color='#333' />
              <Text className='repo_number_title'>{repo.watchers_count}</Text>
            </View>
            <View className='repo_number_item' onClick={this.handleStar.bind(this)}>
              <AtIcon prefixClass='ion'
                      value={hasStar ? 'ios-star' : 'ios-star-outline'}
                      size='25'
                      color={hasStar ? '#ff4949' : '#333'} />
              <Text className='repo_number_title'>{repo.stargazers_count}</Text>
            </View>
            <View className='repo_number_item' onClick={this.handleFork.bind(this)}>
              <AtIcon prefixClass='ion' value='ios-git-network' size='25' color='#333' />
              <Text className='repo_number_title'>{repo.forks_count}</Text>
            </View>
          </View>
          <Button className='share_button' openType='share'>Share</Button>
        </View>
        <View className='repo_info_list_view'>
          <View className='repo_info_list' onClick={this.handleNavigate.bind(this, NAVIGATE_TYPE.USER)}>
            <View className='list_title'>Author</View>
            <View className='list_content'>
              <Text className='list_content_title'>{repo.owner.login}</Text>
              <AtIcon prefixClass='ion' value='ios-arrow-forward' size='18' color='#7f7f7f' />
            </View>
          </View>
          <View className='repo_info_list' onClick={this.handleNavigate.bind(this, NAVIGATE_TYPE.REPO_CONTENT_LIST)}>
            <View className='list_title'>View Code</View>
            <AtIcon prefixClass='ion' value='ios-arrow-forward' size='18' color='#7f7f7f' />
          </View>
          <View className='repo_info_list'>
            <View className='list_title'>Branch</View>
            <View className='list_content'>
              <Text className='list_content_title'>{repo.default_branch}</Text>
              {/*<AtIcon prefixClass='ion' value='ios-arrow-forward' size='18' color='#7f7f7f' />*/}
            </View>
          </View>
          <View className='repo_info_list'>
            <View className='list_title'>License</View>
            <View className='list_content'>
              <Text className='list_content_title'>{repo.license.spdx_id || '--'}</Text>
              {/*<AtIcon prefixClass='ion' value='ios-arrow-forward' size='18' color='#7f7f7f' />*/}
            </View>
          </View>
        </View>
        <View className='repo_info_list_view'>
          <View className='repo_info_list' onClick={this.handleNavigate.bind(this, NAVIGATE_TYPE.ISSUES)}>
            <View className='list_title'>Issues</View>
            <View className='list_content'>
              {
                repo.open_issues_count > 0 &&
                <View className='tag'>{repo.open_issues_count}</View>
              }
              <AtIcon prefixClass='ion' value='ios-arrow-forward' size='18' color='#7f7f7f' />
            </View>
          </View>
          {/*<View className='repo_info_list'>*/}
            {/*<View className='list_title'>Pull Requests</View>*/}
            {/*<AtIcon prefixClass='ion' value='ios-arrow-forward' size='18' color='#7f7f7f' />*/}
          {/*</View>*/}
          <View className='repo_info_list' onClick={this.handleNavigate.bind(this, NAVIGATE_TYPE.REPO_CONTRIBUTORS_LIST)}>
            <View className='list_title'>Contributors</View>
            <AtIcon prefixClass='ion' value='ios-arrow-forward' size='18' color='#7f7f7f' />
          </View>
        </View>
        {
          md &&
          <View className='markdown'>
            <Text className='md_title'>README.md</Text>
            <View className='repo_md'>
              <Markdown md={md} />
            </View>
          </View>
        }
        {
          isShare &&
          <View className='home_view' onClick={this.onClickedHome.bind(this)}>
            <AtIcon prefixClass='ion'
                    value='ios-home'
                    size='30'
                    color='#fff' />
          </View>
        }
      </View>
    )
  }
}

export default Repo

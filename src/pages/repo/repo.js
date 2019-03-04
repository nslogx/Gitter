import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Navigator, Ad } from '@tarojs/components'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'
import { AtIcon } from 'taro-ui'
import { base64_decode } from '../../utils/base64'
import { hasLogin } from '../../utils/common'
import { HTTP_STATUS } from '../../constants/status'
import { NAVIGATE_TYPE } from '../../constants/navigateType'
import Markdown from '../../components/repo/markdown'
import Painter from '../../components/repo/painter'

import api from '../../service/api'

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
      hasWatching: false,
      isShare: false,
      loadAd: true,
      baseUrl: null,
      md: null,
      posterData: null
    }
  }

  componentWillReceiveProps (nextProps) {
  }

  componentWillMount() {
    let params = this.$router.params
    this.setState({
      url: decodeURI(params.url),
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
    const { repo, url } = this.state
    let path = '/pages/repo/repo?url=' + encodeURI(url) + '&share=true'
    return {
      title: `「${repo.name}」★${repo.stargazers_count} - 来自GitHub的开源项目，快来看看吧~~`,
      path: path
    }
  }

  getRepo() {
    let that = this
    api.get(this.state.url).then((res)=>{
      if (res.statusCode === HTTP_STATUS.SUCCESS) {
        let baseUrl = 'https://raw.githubusercontent.com/' + res.data.full_name + '/master/'
        that.setState({
          repo: res.data,
          baseUrl: baseUrl
        }, ()=>{
          that.getReadme()
          that.checkStarring()
          // that.checkWatching()
        })
      } else {
        Taro.showToast({
          icon: 'none',
          title: res.data.message
        })
      }
      Taro.stopPullDownRefresh()
      Taro.hideLoading()
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

  checkWatching() {
    if (hasLogin()) {
      const { repo } = this.state
      let that = this
      let url =  '/repos/' + repo.full_name + '/subscription'
      api.get(url).then((res)=>{
        that.setState({
          hasWatching: res.statusCode === 200
        })
      })
    }
  }

  handleStar() {
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
    const { hasStar, repo } = this.state
    let url = '/user/starred/' + repo.full_name
    let that = this
    if (hasStar) {
      api.delete(url).then((res)=>{
        if (res.statusCode === 204) {
          that.getRepo()
        } else {
          Taro.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    } else {
      api.put(url).then((res)=>{
        if (res.statusCode === 204) {
          that.getRepo()
        } else {
          Taro.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    }
  }

  handleFork() {
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
    const { repo } = this.state
    let url = '/repos/' + repo.full_name + '/forks'
    api.post(url).then((res)=>{
      Taro.hideLoading()
      if (res.statusCode === HTTP_STATUS.ACCEPTED) {
        Taro.showToast({
          title: 'Success!',
          icon: 'success'
        })
      } else {
        Taro.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
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
      case NAVIGATE_TYPE.REPO_EVENTS_LIST: {
        let url = '/pages/repo/repoEvents?url=/repos/' + repo.full_name + '/events'
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

  onClickedActionButton(index) {
    console.log(index)
    const { repo } = this.state
    if (index === 1) {
      this.loadWXACode()
    } else if (index === 2) {
      const url = `https://github.com/${repo.full_name}`
      Taro.setClipboardData({
        data: url
      })
    }
  }

  loadWXACode() {
    const { repo, url } = this.state
    const path = '/pages/repo/repo?url=' + encodeURI(url) + '&share=true'
    let that = this
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'wxacode',
      // 传递给云函数的event参数
      data: {
        path: path,
        name: `${repo.owner.login}_${repo.name}`
      }
    }).then(res => {
      console.log('wxacode', res)
      if (res.result && res.result.length > 0) {
        that.generatePoster(res.result[0].tempFileURL)
      } else {
        Taro.hideLoading()
      }
    }).catch(err => {
      Taro.hideLoading()
    })
  }

  generatePoster(imgUrl) {
    const { repo } = this.state
    const data = {
      background: '#f7f7f7',
      width: '750rpx',
      height: '1100rpx',
      borderRadius: '0rpx',
      views: [
        {
          type: 'rect',
          css: {
            left: '50rpx',
            width: '650rpx',
            top: '50rpx',
            color: '#ffffff',
            height: '900rpx',
            borderRadius: '20rpx',
            shadow: '10rpx 10rpx 5rpx #888888',
          }
        },
        {
          type: 'rect',
          css: {
            left: '50rpx',
            width: '650rpx',
            height: '640rpx',
            top: '50rpx',
            color: '#2d8cf0',
            borderRadius: '20rpx',
          }
        },
        {
          type: 'rect',
          css: {
            left: '50rpx',
            width: '650rpx',
            height: '50rpx',
            top: '640rpx',
            color: '#2d8cf0',
          }
        },
        {
          type: 'text',
          text: `「${repo.name}」`,
          css: {
            top: '80rpx',
            left: '375rpx',
            align: 'center',
            fontSize: '38rpx',
            color: '#ffffff',
            width: '550rpx',
            maxLines: '1',
          }
        },
        {
          type: 'text',
          text: `Stars：★${repo.stargazers_count}  ${repo.stargazers_count > 99 ? '🔥' : ''}`,
          css: {
            top: '150rpx',
            left: '80rpx',
            width: '550rpx',
            maxLines: '1',
            fontSize: '28rpx',
            color: '#ffffff'
          }
        },
        {
          type: 'text',
          text: `作者：${repo.owner.login}`,
          css: {
            top: '250rpx',
            left: '80rpx',
            width: '550rpx',
            maxLines: '1',
            fontSize: '28rpx',
            color: '#ffffff'
          }
        },
        {
          type: 'text',
          text: `GitHub：https://github.com/${repo.full_name}`,
          css: {
            top: '350rpx',
            left: '80rpx',
            width: '550rpx',
            fontSize: '28rpx',
            color: '#ffffff',
            lineHeight: '36rpx',
            maxLines: '2',
          }
        },
        {
          type: 'text',
          text: `项目描述：${repo.description || '暂无描述'}`,
          css: {
            top: '450rpx',
            left: '80rpx',
            width: '550rpx',
            fontSize: '28rpx',
            maxLines: '4',
            color: '#ffffff',
            lineHeight: '36rpx'
          }
        },
        {
          type: 'image',
          url: `${imgUrl}`,
          css: {
            bottom: '180rpx',
            left: '120rpx',
            width: '200rpx',
            height: '200rpx',
          },
        },
        {
          type: 'text',
          text: '长按识别，查看项目详情',
          css: {
            bottom: '290rpx',
            left: '350rpx',
            fontSize: '28rpx',
            color: '#666666'
          }
        },
        {
          type: 'text',
          text: '分享自「Gitter」',
          css: {
            bottom: '230rpx',
            left: '350rpx',
            fontSize: '28rpx',
            color: '#666666',
          }
        },
        {
          type: 'text',
          text: '开源的世界，有你才更精彩',
          css: {
            bottom: '60rpx',
            left: '375rpx',
            align: 'center',
            fontSize: '28rpx',
            color: '#666666',
          }
        }
      ],
    }
    this.setState({
      posterData: data
    })
  }

  onPainterFinished() {
    console.log('onPainterFinished')
    this.setState({
      posterData: null
    })
  }

  loadError(event) {
    this.setState({
      loadAd: false
    })
    console.log(event.detail)
  }

  render () {
    const { repo, hasStar, isShare, md, baseUrl, loadAd, posterData } = this.state
    console.log('posterData', posterData)
    if (!repo) return <View />
    return (
      <View className='content'>
        <View className='repo_bg_view'>
          <Text className='repo_info_title'>{repo.name}</Text>
          {
            repo.fork &&
            <View className='fork'>
              <AtIcon prefixClass='ion' value='ios-git-network' size='15' color='#fff' />
              <Navigator url={'/pages/repo/repo?url=' + encodeURI(repo.parent.url)}>
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
              <Text className='repo_number_title'>{repo.subscribers_count}</Text>
            </View>
            <View className='repo_number_item' onClick={this.handleStar.bind(this)}>
              <AtIcon prefixClass='ion'
                      value={hasStar ? 'ios-star' : 'ios-star-outline'}
                      size='25'
                      color={hasStar ? '#333' : '#333'} />
              <Text className='repo_number_title'>{repo.stargazers_count}</Text>
            </View>
            <View className='repo_number_item' onClick={this.handleFork.bind(this)}>
              <AtIcon prefixClass='ion' value='ios-git-network' size='25' color='#333' />
              <Text className='repo_number_title'>{repo.forks_count}</Text>
            </View>
          </View>
          <View className='share_item_view'>
            <View className='repo_share_item'>
              <Button className='action_button'
                      openType='share'
                      onClick={this.onClickedActionButton.bind(this, 0)}>
                <AtIcon prefixClass='ion' value='ios-share-alt' size='25' color='#333' />
                <Text className='action_button_title'>share</Text>
              </Button>
            </View>
            <View className='repo_share_item'>
              <Button className='action_button'
                      onClick={this.onClickedActionButton.bind(this, 1)}>
                <AtIcon prefixClass='ion' value='md-images' size='22' color='#333' />
                <Text className='action_button_title'>save</Text>
              </Button>
            </View>
            <View className='repo_share_item'>
              <Button className='action_button'
                      onClick={this.onClickedActionButton.bind(this, 2)}>
                <AtIcon prefixClass='ion' value='ios-link' size='23' color='#333' />
                <Text className='action_button_title'>copy</Text>
              </Button>
            </View>
          </View>
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
          <View className='repo_info_list' onClick={this.handleNavigate.bind(this, NAVIGATE_TYPE.REPO_EVENTS_LIST)}>
            <View className='list_title'>Events</View>
            <AtIcon prefixClass='ion' value='ios-arrow-forward' size='18' color='#7f7f7f' />
          </View>
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
              <Markdown md={md} base={baseUrl} />
            </View>
          </View>
        }
        {
          (md && loadAd) &&
          <View className='ad'>
            <Text className='support'>Support Gitter ❤</Text>
            <Ad unitId='adunit-04a1d10f49572d65' onError={this.loadError.bind(this)} />
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
        {
          posterData && <Painter style='position:fixed;top:-9999rpx' data={posterData} save onPainterFinished={this.onPainterFinished}/>
        }
      </View>
    )
  }
}

export default Repo

import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'
import ContentListItem from '../../components/account/contentListItem'

import api from '../../service/api'

import './contentList.less'

class ContentList extends Component {

  config = {
    navigationBarTitleText: ''
  }

  constructor(props) {
    super(props)
    this.state = {
      repo: null,
      path: null,
      name: null,
      dataList: []
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount() {
    let params = this.$router.params
    let path = params.path || null
    let name = params.name || null
    this.setState({
      repo: params.repo,
      path: path,
      name: name
    })
  }

  componentDidMount() {
    const { repo, name } = this.state
    Taro.setNavigationBarTitle({
      title: name || repo.split('/')[1]
    })
    this.getContents()
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  getContents() {
    let that = this
    const { repo, path } = this.state
    let url = '/repos/' + repo + '/contents'
    if (path) {
      url = url + '/' + path
    }
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
    api.get(url).then((res)=>{
      that.setState({
        dataList: res.data
      })
      Taro.hideLoading()
    })
  }

  handleItemClick(item) {
    if (item.type === 'dir') {
      // 文件夹
      Taro.navigateTo({
        url: '/pages/repo/contentList?repo=' + this.state.repo + '&path=' + item.path + '&name=' + item.name
      })
    } else if (item.type === 'file') {
      // 文件
      Taro.navigateTo({
        url: '/pages/repo/file?url=' + item.url
      })
    }
  }

  render () {
    const { dataList } = this.state
    return (
      <View className='content'>
        {
          dataList.map((item, index) => {
            return (
              <View key={index} onClick={this.handleItemClick.bind(this, item)}>
                <ContentListItem item={item} />
              </View>
            )
          })
        }
      </View>
    )
  }
}

export default ContentList

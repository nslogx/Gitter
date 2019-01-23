import Taro, { Component } from '@tarojs/taro'
import {Text, View} from '@tarojs/components'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'
import { base64_decode } from '../../utils/base64'
import Markdown from '../../components/repo/markdown'

import api from '../../service/api'

import './file.less'

class File extends Component {

  config = {
    navigationBarTitleText: ''
  }

  constructor(props) {
    super(props)
    this.state = {
      file: null,
      url: null
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount() {
    let params = this.$router.params
    this.setState({
      url: params.url
    })
  }

  componentDidMount() {
    this.getFile()
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  getFile() {
    let that = this
    const { url } = this.state
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
    api.get(url).then((res)=>{
      that.setState({
        file: res.data
      }, ()=>{
        Taro.setNavigationBarTitle({
          title: that.state.file.name
        })
      })
      Taro.hideLoading()
    })
  }

  render () {
    const { file } = this.state
    if (!file) return <View />
    let md = ''
    if (file.content.length > 0) {
      md = base64_decode(file.content)
    }
    return (
      <View className='content'>
        {
          md.length > 0 &&
          <View className='markdown'>
            <View className='md'>
              <Markdown md={md} />
            </View>
          </View>
        }
      </View>
    )
  }
}

export default File

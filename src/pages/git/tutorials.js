import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import Markdown from '../../components/repo/markdown'
import { base64_decode } from '../../utils/base64'

import './tutorials.less'
import {GLOBAL_CONFIG} from "../../constants/globalConfig";

class Tutorials extends Component {

  config = {
  }

  constructor(props) {
    super(props)
    this.state = {
      item: null,
      md: null,
      isShare: false,
      // show: false,
      // itemList: [],
      // menus: []
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount() {
    let params = this.$router.params
    this.setState({
      item: JSON.parse(decodeURI(params.value)),
      isShare: params.share
    }, ()=> {
      Taro.setNavigationBarTitle({
        title: this.state.item.title
      })
    })
  }

  componentDidMount() {
    this.loadLocalItem()
    // this.loadMenus()
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  loadLocalItem() {
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
    let that = this
    const { item } = this.state
    let key = `git_content_${item.item_id}`
    Taro.getStorage({
      key: key,
      success(res) {
        console.log(res)
      },
      complete(res) {
        console.log('content complete', res)
        if (res.data) {
          that.setState({
            md: base64_decode(res.data.content)
          })
          Taro.hideLoading()
        } else {
          that.loadItem()
        }
      }
    })
  }

  loadItem() {
    const { item } = this.state
    let that = this
    const db = wx.cloud.database()
    db.collection('git_tutorials_content')
      .where({
        item_id: item.item_id,
    }).get()
      .then(res => {
        if (res.data.length > 0) {
          that.setState({
            md: base64_decode(res.data[0].content)
          })
          let key = `git_content_${item.item_id}`
          Taro.setStorage({
            key: key,
            data: res.data[0]
          })
        }
        Taro.hideLoading()
      })
      .catch(err => {
        console.error(err)
        Taro.hideLoading()
      })
  }

  // loadMenus() {
  //   const dataList = getGlobalData('git_list')
  //   let menus = []
  //   let itemList = []
  //   for (let item of dataList) {
  //     for (let sub_item of item.children) {
  //       menus.push(sub_item.title)
  //       itemList.push(sub_item)
  //     }
  //   }
  //   this.setState({
  //     itemList: itemList,
  //     menus: menus
  //   })
  // }

  onShareAppMessage(obj) {
    const { item } = this.state

    let value = encodeURI(JSON.stringify(item))
    const path = `/pages/git/tutorials?value=${value}&share=true`

    return {
      title: `Git 中文教程之：${item.title}`,
      path: path
    }
  }

  onClickedHome () {
    Taro.reLaunch({
      url: '/pages/index/index'
    })
  }

  render() {
    const { md, item, isShare } = this.state
    let cacheKey = ''
    if (item) {
      cacheKey = `git_md_content_${item.item_id}`
    }
    return (
      <View className='content'>
        {
          md &&
          <View className='markdown'>
            <View className='md'>
              <Markdown md={md} cache={cacheKey.length > 0} cacheKey={cacheKey} />
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

export default Tutorials

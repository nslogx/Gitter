import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import Markdown from '../../components/repo/markdown'
import { base64_decode } from '../../utils/base64'
import { AtDrawer } from 'taro-ui'
import { get as getGlobalData  } from '../../utils/global_data'

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
      show: false,
      itemList: [],
      menus: []
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount() {
    let params = this.$router.params
    this.setState({
      item: JSON.parse(decodeURI(params.value))
    }, ()=> {
      Taro.setNavigationBarTitle({
        title: this.state.item.title
      })
    })
  }

  componentDidMount() {
    this.loadLocalItem()
    this.loadMenus()
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

  loadMenus() {
    const dataList = getGlobalData('git_list')
    let menus = []
    let itemList = []
    for (let item of dataList) {
      for (let sub_item of item.children) {
        menus.push(sub_item.title)
        itemList.push(sub_item)
      }
    }
    this.setState({
      itemList: itemList,
      menus: menus
    })
  }

  onClickedFilter() {
    this.setState({
      show: true
    })
  }

  render() {
    const { md, show, item, menus } = this.state
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
        {/*<View className='filter' onClick={this.onClickedFilter.bind(this)}>*/}
          {/*<AtIcon value='filter' size='25' color='#ffffff' />*/}
        {/*</View>*/}
        <AtDrawer
          show={show}
          items={menus}
          mask
        / >
      </View>
    )
  }
}

export default Tutorials

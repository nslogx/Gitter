import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { get as getGlobalData, set as setGlobalData  } from '../../utils/global_data'
import { AtTag, AtIndexes } from 'taro-ui'
import { languages } from '../../assets/languages/languages'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'

import './favoriteLanguages.less'

class FavoriteLanguages extends Component {

  config = {
    navigationBarTitleText: 'Favorite Languages'
  }

  constructor(props) {
    super(props)
    this.state = {
      itemId: null,
      favoriteLanguages: []
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount() {
  }

  componentDidMount() {
    // this.saveLanguages()
    this.loadLanguages()
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  loadLanguages() {
    let that = this
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
    const db = wx.cloud.database()
    let openid = getGlobalData('openid')
    if (!openid) {
      openid = Taro.getStorageSync('openid')
    }
    db.collection('languages')
      .where({
        _openid: openid, // 当前用户 openid
      })
      .get()
      .then(res => {
        console.log(res)
        Taro.hideLoading()
        if (res.data.length > 0) {
          that.setState({
            itemId: res.data[0]._id,
            favoriteLanguages: res.data[0].languages
          })
        }
      })
      .catch(err => {
        Taro.hideLoading()
        console.error(err)
      })
  }

  saveLanguages() {
    let that = this
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
    const { favoriteLanguages, itemId } = this.state
    const db = wx.cloud.database()
    if (itemId && itemId.length > 0) {
      // 更新
      db.collection('languages').doc(itemId).update({
        data: {
          languages: favoriteLanguages
        }
      })
        .then(res => {
          Taro.hideLoading()
          console.log(res)
          setGlobalData('favoriteLanguages', favoriteLanguages)
        })
        .catch(console.error)
    } else {
     // 新增
      db.collection('languages').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          languages: favoriteLanguages
        }
      })
        .then(res => {
          Taro.hideLoading()
          console.log(res)
          that.setState({
            itemId: res._id
          })
          setGlobalData('favoriteLanguages', favoriteLanguages)
        })
        .catch(console.error)
    }
  }

  onClick (item) {
    let that = this
    const { favoriteLanguages } = this.state
    let exits = false
    for (let language of favoriteLanguages) {
      if (language.name === item.name) {
        exits = true
        break
      }
    }
    if (!exits) {
      favoriteLanguages.unshift(item)
      this.setState({
        favoriteLanguages: favoriteLanguages
      }, ()=> {
        that.saveLanguages()
      })
    } else {
      Taro.showToast({
        title: 'Already exist!',
        icon: 'none'
      })
    }
  }

  onTagClick (item) {
    let that = this
    const { favoriteLanguages } = this.state
    for (let language of favoriteLanguages) {
      if (language.name === item.name) {
        favoriteLanguages.splice(favoriteLanguages.indexOf(language), 1)
        break
      }
    }
    this.setState({
      favoriteLanguages: favoriteLanguages
    }, ()=> {
      that.saveLanguages()
    })
  }

  render() {
    const { favoriteLanguages } = this.state
    const list = favoriteLanguages.map((item, index) => {
      return <View key={index} className='tag-item'>
        <AtTag circle active onClick={this.onTagClick.bind(this)} name={item.name}>{item.name}</AtTag>
      </View>
    })
    return (
      <View className='content'>
        <AtIndexes list={languages}
                   onClick={this.onClick.bind(this)} >
          {
            favoriteLanguages.length > 0 &&
            <View className='header-view'>
              <View className='header-title'>tips: Click to delete</View>
              <View className='tag-view'>
                {list}
              </View>
            </View>
          }
        </AtIndexes>
      </View>
    )
  }
}

export default FavoriteLanguages

import Taro, { Component } from '@tarojs/taro'
import { Image, View, Text } from '@tarojs/components'
import { AtAccordion } from 'taro-ui'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'
import { set as setGlobalData  } from '../../utils/global_data'

import GitItem from '../../components/git/gitItem'
import Empty from '../../components/index/empty'

import './git.less'

class Git extends Component {

  config = {
    navigationBarTitleText: 'Git Tutorials'
  }

  constructor(props) {
    super(props)
    this.state = {
      itemList: []
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount() {
  }

  componentDidMount() {
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
    let that = this
    Taro.getStorage({
      key: 'git_list',
      success(res) {
        console.log(res)
      },
      complete(res) {
        console.log('complete', res)
        if (res.data) {
          that.setState({
            itemList: res.data
          })
          setGlobalData('git_list', res.data)
          Taro.hideLoading()
        } else {
          that.loadItemList()
        }
      }
    })
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  loadItemList() {
    let that = this
    const db = wx.cloud.database()
    db.collection('git_tutorials')
      .get()
      .then(res => {
        that.setState({
          itemList: res.data
        })
        Taro.setStorage({
          key: 'git_list',
          data: res.data
        })
        setGlobalData('git_list', res.data)
        Taro.hideLoading()
      })
      .catch(err => {
        console.error(err)
        Taro.hideLoading()
      })
  }

  onShareAppMessage(obj) {
    return {
      title: '嗨！优秀的 Git 中文教程了解一下~~'
    }
  }

  render() {
    const { itemList } = this.state
    const list = itemList.map((item, index)=>{
      return (
        <View key={index}>
          <AtAccordion title={item.title} open={false}>
            <GitItem item={item} />
          </AtAccordion>
        </View>
      )
    })

    return (
      <View>
        {
          itemList && itemList.length > 0 ? (
            <View className='content'>
              <View className='logo-bg'>
                <Image mode='aspectFit'
                       className='logo'
                       src={require('../../assets/images/octocat.png')}/>
              </View>
              {list}
              <View className='info-view'>
                <Text className='info'>- Pro Git -</Text>
              </View>
            </View>
          ) : (<Empty />)
        }
      </View>
    )
  }
}

export default Git

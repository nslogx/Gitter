import Taro, { Component } from '@tarojs/taro'
import {Image, View} from '@tarojs/components'
import { AtAccordion, AtList, AtListItem } from 'taro-ui'

import GitItem from '../../components/git/gitItem'

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
    this.loadItemList()
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
        console.log(res)
        that.setState({
          itemList: res.data
        })
      })
      .catch(err => {
        console.error(err)
      })
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
      <View className='content'>
        <View className='logo-bg'>
          <Image mode='aspectFit'
                 className='logo'
                 src={require('../../assets/images/octocat.png')}/>
        </View>
        {list}
      </View>
    )
  }
}

export default Git

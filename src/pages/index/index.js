import Taro, { Component } from '@tarojs/taro'
import { View, Picker, Text } from '@tarojs/components'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'
import { AtTabs, AtTabsPane, AtSearchBar } from 'taro-ui'
import { languages } from '../../utils/language'

import ItemList from '../../components/index/itemList'

import './index.less'

class Index extends Component {

  config = {
    navigationBarTitleText: 'Trending',
    enablePullDownRefresh: true
  }

  constructor (props) {
    super(props)
    this.state = {
      current: 0,
      category: {
        'name': 'Today',
        'value': 'daily'
      },
      language: {
        'name': 'All',
        'urlParam': ''
      },
      animation: null,
      scrollTop: null,
      scrollHeight: 0,
      isHidden: false,
      repos: [],
      developers: [],
      range: [
        [{'name': 'Today',
        'value': 'daily'},
        {'name': 'Week',
          'value': 'weekly'},
        {'name': 'Month',
          'value': 'monthly'}],
        languages
      ]
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentDidMount() {
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
    this.loadItemList()
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onPullDownRefresh() {
    this.loadItemList()
  }

  onPageScroll(e) {
    if (e.scrollTop <= 0) {
      // 滚动到最顶部
      e.scrollTop = 0;
    } else if (e.scrollTop > this.state.scrollHeight) {
      // 滚动到最底部
      e.scrollTop = this.state.scrollHeight;
    }
    if (e.scrollTop > this.state.scrollTop || e.scrollTop >= this.state.scrollHeight) {
      //向下滚动
      if (!this.state.isHidden) {
        let animation = Taro.createAnimation({
          duration: 400,
          timingFunction: 'ease',
        }).bottom(-95).step().export()
        this.setState({
          isHidden: true,
          animation: animation
        })
      }
    } else {
      //向上滚动
      if (this.state.isHidden) {
        let animation = Taro.createAnimation({
          duration: 400,
          timingFunction: 'ease',
        }).bottom(25).step().export()
        this.setState({
          isHidden: false,
          animation: animation
        })
      }
    }
    //给scrollTop重新赋值
    this.setState({
      scrollTop: e.scrollTop
    })
  }

  getScrollHeight() {
    let that = this
    Taro.createSelectorQuery().select('#list').boundingClientRect((rect)=>{
      that.setState({
        scrollHeight: rect.height - 456
      })
    }).exec()
  }

  handleClick (value) {
    let that = this
    this.setState({
      current: value
    }, ()=>{
      that.getScrollHeight()
    })
  }

  onChange = e => {
    this.setState({
      category: this.state.range[0][e.detail.value[0]],
      language: this.state.range[1][e.detail.value[1]]
    }, () => {
      Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
      this.loadItemList()
    })
  }

  loadItemList () {
    const { current } = this.state
    let that = this
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'trend',
      // 传递给云函数的event参数
      data: {
        type: 'repositories',
        language: that.state.language.urlParam,
        since: that.state.category.value
      }
    }).then(res => {
      that.setState({
        repos: res.result.data
      }, ()=>{
        if (current === 0) {
          that.getScrollHeight()
          Taro.hideLoading()
          Taro.stopPullDownRefresh()
        }
      })
    }).catch(err => {
      Taro.hideLoading()
      Taro.stopPullDownRefresh()
    })

    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'trend',
      // 传递给云函数的event参数
      data: {
        type: 'developers',
        language: that.state.language.urlParam,
        since: that.state.category.value
      }
    }).then(res => {
      that.setState({
        developers: res.result.data
      }, ()=>{
        if (current === 1) {
          Taro.stopPullDownRefresh()
          that.getScrollHeight()
          Taro.hideLoading()
        }
      })
    }).catch(err => {
      Taro.hideLoading()
      Taro.stopPullDownRefresh()
    })
  }

  onActionSearch () {
    Taro.navigateTo({
      url: '/pages/search/index'
    })
  }

  onShareAppMessage(obj) {
    return {
      title: 'Github 今日热榜，随时随地发现您喜欢的开源项目',
      path: '/pages/index/index',
      imageUrl: 'http://img.huangjianke.com/cover.png'
    }
  }

  render () {
    let categoryType = 0
    let categoryValue = this.state.category.value
    if (categoryValue === 'weekly') {
      categoryType = 1
    } else if (categoryValue === 'monthly') {
      categoryType = 2
    }
    const { developers, repos } = this.state
    return (
      <View className='content' id='list'>
        <View className='search_bg' onClick={this.onActionSearch.bind(this)}>
          <AtSearchBar
            disabled={true}
            placeholder='Search'
            actionName=''
          />
        </View>
        <AtTabs
          swipeable={false}
          animated={true}
          current={this.state.current}
          tabList={[
            { title: 'Repositories' },
            { title: 'Developers' }
          ]}
          onClick={this.handleClick.bind(this)} >
          <AtTabsPane current={this.state.current} index={0}>
            <ItemList itemList={repos} type={0} categoryType={categoryType} />
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1}>
            <ItemList itemList={developers} type={1} categoryType={categoryType} />
          </AtTabsPane>

        </AtTabs>
        {
          this.state.range[1].length > 0 &&
          <View>
            <Picker mode='multiSelector'
                    range={this.state.range}
                    rangeKey={'name'}
                    onChange={this.onChange}
            >
              <View className='filter' animation={this.state.animation}>
                <Text className='category'>{this.state.category.name}</Text>
                &
                <Text className='language'>{this.state.language.name}</Text>
              </View>
            </Picker>
          </View>
        }
      </View>
    )
  }
}

export default Index

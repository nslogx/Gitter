import Taro, { Component } from '@tarojs/taro'
import { View, Picker, Text, Swiper, SwiperItem, ScrollView } from '@tarojs/components'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'
import { languages } from '../../utils/language'

import ItemList from '../../components/index/itemList'
import Segment from '../../components/index/segment'

import './index.less'

class Index extends Component {

  config = {
    navigationBarTitleText: 'Trending',
    enablePullDownRefresh: false
  }

  constructor (props) {
    super(props)
    this.state = {
      current: 0,
      windowHeight: 0,
      category: {
        'name': 'Today',
        'value': 'daily'
      },
      language: {
        'name': 'All',
        'urlParam': ''
      },
      animation: null,
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

    let that = this
    Taro.getSystemInfo({
      success(res) {
        that.setState({
          windowHeight: res.windowHeight - (res.windowWidth / 750) * 80
        })
      }
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onPullDownRefresh() {
    this.loadItemList()
  }

  onScroll(e) {
    if (e.detail.scrollTop < 0) return;
    if (e.detail.deltaY > 0) {
      let animation = Taro.createAnimation({
        duration: 400,
        timingFunction: 'ease',
      }).bottom(25).step().export()
      this.setState({
        isHidden: false,
        animation: animation
      })
    } else {
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
    }
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

  onSwiperChange(e) {
    console.log(e.detail.current)
    this.setState({
      current: e.detail.current
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
          Taro.hideLoading()
        }
      })
    }).catch(err => {
      Taro.hideLoading()
      Taro.stopPullDownRefresh()
    })
  }

  onTabChange(index) {
    this.setState({
      current: index
    })
  }

  onRefresh() {
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
    this.loadItemList()
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
    const { developers, repos, current, windowHeight } = this.state
    return (
      <View className='content' id='list'>
        <Segment current={current}
                 onTabChange={this.onTabChange}
                 onRefresh={this.onRefresh} />
        <Swiper indicatorDots={false}
                current={current}
                style='height: {{windowHeight}}px'
                onChange={this.onSwiperChange}
        >
          <SwiperItem>
            <ScrollView scrollY style='height: {{windowHeight}}px' onScroll={this.onScroll}>
              <ItemList itemList={repos} type={0} categoryType={categoryType} />
              <View className='bottom' />
            </ScrollView>
          </SwiperItem>
          <SwiperItem>
            <ScrollView scrollY style='height: {{windowHeight}}px' onScroll={this.onScroll}>
              <ItemList itemList={developers} type={1} categoryType={categoryType} />
              <View className='bottom' />
            </ScrollView>
          </SwiperItem>
        </Swiper>
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

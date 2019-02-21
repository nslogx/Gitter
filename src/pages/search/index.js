import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'

import SearchBar from '../../components/search/searchBar'
import SearchHistory from '../../components/search/searchHistory'

import './index.less'

class Index extends Component {

  config = {
    navigationBarTitleText: 'Search'
  }

  constructor(props) {
    super(props)
    this.state = {
      history: []
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentDidMount() {
    this.loadHistory()
  }

  componentWillUnmount () { }

  componentDidShow () {
    this.loadHistory()
  }

  componentDidHide () { }

  loadHistory() {
    let that = this
    Taro.getStorage({
      key: 'search_history',
      success(res) {
        if (res.data.length > 0) {
          that.setState({
            history: res.data
          })
        }
      }
    })
  }

  updateHistory(value) {
    const { history } = this.state
    for (let item of history) {
      if (value === item) {
        history.splice(history.indexOf(item), 1)
        break
      }
    }
    history.unshift(value)
    let that = this
    Taro.setStorage({
      key: 'search_history',
      data: history,
      success(res) {
        that.loadHistory()
      }
    })
  }

  onClickSearch(e) {
    const value = e.detail.value
    if (value && value.length > 0) {
      this.updateHistory(value)
      let url = '/pages/search/searchResult?value=' + encodeURI(value)
      Taro.navigateTo({
        url: url
      })
    } else {
      Taro.showToast({
        title: 'Please input content',
        icon: 'none'
      })
    }
  }

  onTagClick (item) {
    this.updateHistory(item.name)
    let url = '/pages/search/searchResult?value=' + encodeURI(item.name)
    Taro.navigateTo({
      url: url
    })
  }

  clear_history() {
    console.log('clear')
    Taro.removeStorage({
      key: 'search_history'
    })
    this.setState({
      history: []
    })
  }

    render () {
    const { history } = this.state
    return (
      <View className='content'>
        <View className='search-bar-fixed'>
          <SearchBar onClickSearch={this.onClickSearch} />
        </View>
        {
          history.length > 0 &&
          <View className='search-history-bg'>
            <View className='search-history'>
              <SearchHistory items={history} onTagClick={this.onTagClick}/>
            </View>
            <View className='clear' onClick={this.clear_history.bind(this)}>Clear All</View>
          </View>
        }
      </View>
    )
  }
}

export default Index

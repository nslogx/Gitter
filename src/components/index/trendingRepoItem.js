import Taro, { Component } from '@tarojs/taro'
import PropTypes from 'prop-types';
import { View } from '@tarojs/components'
import { AtIcon } from 'taro-ui'


import './trendingRepoItem.less'

export default class TrendingRepoItem extends Component {
  static propTypes = {
    item: PropTypes.object,
    categoryType: PropTypes.number
  }

  static defaultProps = {
    item: null,
    categoryType: 0
  }

  render() {
    const { item, categoryType } = this.props
    if (!item) return <View />

    let currentPeriod = null
    if (categoryType === 0) {
      currentPeriod = item.currentPeriodStars + ' stars today'
    }else if (categoryType === 1) {
      currentPeriod = item.currentPeriodStars + ' stars this week'
    }else if (categoryType === 2) {
      currentPeriod = item.currentPeriodStars + ' stars this month'
    }

    return (
     <View className='content'>
       <View className='title_view'>
         <AtIcon prefixClass='ion' value='md-bookmarks' size='25' color='#333' />
         <View className='repo_title'>{item.author}/{item.name}</View>
       </View>
       <View className='repo_desc'>{item.description}</View>
       <View className='number_info'>
         {
           item.language.length > 0 &&
           <View className='number_item'>
             <AtIcon prefixClass='ion' value='ios-radio-button-on' size='15' color={item.languageColor} />
             <View className='number_title'>{item.language}</View>
           </View>
         }
         <View className='number_item'>
           <AtIcon prefixClass='ion' value='ios-star' size='15' color='#7f7f7f' />
           <View className='number_title'>{item.stars}</View>
         </View>
         <View className='number_item'>
           <AtIcon prefixClass='ion' value='ios-git-network' size='15' color='#7f7f7f' />
           <View className='number_title'>{item.forks}</View>
         </View>
       </View>
       <View className='today_view'>
         <AtIcon prefixClass='ion' value='ios-star' size='17' color='#ff4949' />
         <View className='today_title'>{currentPeriod}</View>
       </View>
     </View>
    )
  }

}

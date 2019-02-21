import Taro, { Component } from '@tarojs/taro'
import PropTypes from 'prop-types';
import { View, Input } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

import './searchBar.less'

export default class SearchBar extends Component {

  static propTypes = {
    onClickSearch: PropTypes.func,
  }

  static defaultProps = {
    onClickSearch: () => {}
  }

  componentWillMount() {
  }

  render() {
    const { onClickSearch } = this.props
    return (
      <View className='content'>
        <View className='search-bar-bg'>
          <AtIcon className='icon' value='search' size='18' color='#666' />
          <Input className='search-bar'
                 type='text'
                 placeholder='Search what you want...'
                 confirmType='search'
                 focus
                 onConfirm={onClickSearch.bind(this)}
          />
          <View className='icon' />
          {/*<AtIcon className='icon'*/}
                  {/*value='close'*/}
                  {/*size='18'*/}
                  {/*color='#666'*/}
                  {/*onClick={this.onClickClear.bind(this)} />*/}
        </View>
      </View>
    )
  }
}

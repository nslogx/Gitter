import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'
import reposAction from '../../actions/repos'
import { base64_decode } from '../../utils/base64'

import './repo.less'

class Repo extends Component {

  config = {
    navigationBarTitleText: 'Repo',
    enablePullDownRefresh: true,
    usingComponents: {
      wemark: '../../components/wemark/wemark'
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      url: ''
    }
  }

  componentWillReceiveProps (nextProps) {
  }

  componentWillMount() {
    let params = this.$router.params
    console.log(params)
    this.setState({
      url: params.url
    })
  }

  componentDidMount() {
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
    let params = {
      url: this.state.url
    }
    reposAction.getRepo(params).then(()=>{
      Taro.hideLoading()
    })
  }

  onPullDownRefresh() {

  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    const { readme } = this.props
    if (!readme) return <View />
    let md = ''
    if (readme.content && readme.content.length > 0) {
      md = base64_decode(readme.content)
    }
    return (
      <View className='content'>
        {/*<View className='markdown'>*/}
          {/*<wemark md={md} link highlight type='wemark' />*/}
        {/*</View>*/}
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    readme: state.repos.readme,
  }
}
export default connect(mapStateToProps)(Repo)

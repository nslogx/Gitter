import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'
import { AtTextarea } from 'taro-ui'
import { HTTP_STATUS } from '../../constants/status'

import api from '../../service/api'

import './addComment.less'

class AddComment extends Component {

  config = {
    navigationBarTitleText: 'New Comment'
  }

  constructor(props) {
    super(props)
    this.state = {
      url: null,
      comment: null
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount() {
    let params = this.$router.params
    this.setState({
      url: decodeURI(params.url)
    })
  }

  componentDidMount() {
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  handleTextareaChange (event) {
    this.setState({
      comment: event.target.value
    })
  }

  handleSubmit () {
    const { comment, url } = this.state
    if (comment.length === 0) {
      Taro.showToast({
        title: 'Please input Comment',
        icon: 'none'
      })
    } else {
      Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
      let source = '\n\n\n\n\n\n**来自GitHub小程序客户端：**\n\n![image](https://user-images.githubusercontent.com/8692455/51429898-b159f400-1c4e-11e9-91a1-59cd1fab5042.png)'
      let body =  comment + source
      let params = {
        body: body
      }
      api.post(url, params).then((res)=>{
        if (res.statusCode === HTTP_STATUS.CREATED) {
          Taro.navigateBack()
        } else {
          Taro.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
        Taro.hideLoading()
      })
    }
  }

  render () {
    return (
      <View className='content'>
        <View className='issue_comment'>
          <AtTextarea
            className='input_comment'
            height={200}
            count={false}
            maxlength={10000}
            value={this.state.comment}
            onChange={this.handleTextareaChange.bind(this)}
            placeholder='Leave a comment...'
          />
        </View>
        <View className='submit' onClick={this.handleSubmit.bind(this)}>
          Submit new comment
        </View>
      </View>

    )
  }
}

export default AddComment

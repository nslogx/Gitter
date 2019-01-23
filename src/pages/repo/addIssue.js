import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'
import { AtInput, AtTextarea } from 'taro-ui'
import { HTTP_STATUS } from '../../constants/status'

import api from '../../service/api'

import './addIssue.less'

class AddIssue extends Component {

  config = {
    navigationBarTitleText: 'New Issue'
  }

  constructor(props) {
    super(props)
    this.state = {
      repo: null,
      title: '',
      comment: ''
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount() {
    let params = this.$router.params
    this.setState({
      repo: params.repo
    })
  }

  componentDidMount() {
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  handleChange (value) {
    this.setState({
      title: value
    })
  }

  handleTextareaChange (event) {
    this.setState({
      comment: event.target.value
    })
  }

  handleSubmit () {
    const { title, comment } = this.state
    if (title.length === 0) {
      Taro.showToast({
        title: 'Please input title',
        icon: 'none'
      })
    } else {
      Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
      let url = '/repos/' + this.state.repo +  '/issues'
      let source = '\n\n\n\n\n\n**来自GitHub小程序客户端：**\n\n![image](https://user-images.githubusercontent.com/8692455/51429898-b159f400-1c4e-11e9-91a1-59cd1fab5042.png)'
      let body = ''
      if (comment.length > 0) {
        body = comment + source
      } else {
        body = source
      }
      let params = {
        title: title,
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
        <View className='issue_title'>
          <AtInput
            className='input_title'
            name='title'
            title=''
            type='text'
            placeholder='Title'
            value={this.state.title}
            border={false}
            onChange={this.handleChange.bind(this)}
          />
        </View>
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
          Submit new issue
        </View>
      </View>
    )
  }
}

export default AddIssue

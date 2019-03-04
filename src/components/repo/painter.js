import Taro, { Component } from '@tarojs/taro'
import PropTypes from 'prop-types'
import { View, Text } from '@tarojs/components'

import './painter.less'

export default class Painter extends Component {

  config = {
    usingComponents: {
      'painter': '../painter/painter'
    }
  }

  static propTypes = {
    data: PropTypes.object,
    save: PropTypes.bool,
    onPainterFinished: PropTypes.func
  }

  static defaultProps = {
    data: null,
    save: false,
    onPainterFinished: ()=>{}
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  onImgOK(e) {
    console.log('onImgOK', e.detail.path)
    const { save } = this.props
    if (save) {
      this.saveImageToPhotos(e.detail.path)
    }
    Taro.hideLoading()
    this.props.onPainterFinished()
  }

  onImgErr(e) {
    console.log('onImgErr', e)
    Taro.hideLoading()
    this.props.onPainterFinished()
  }

  saveImageToPhotos (filePath) {
    let that = this
    // 相册授权
    Taro.getSetting({
      success(res) {
        // 进行授权检测，未授权则进行弹层授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          Taro.authorize({
            scope: 'scope.writePhotosAlbum',
            success () {
              that.saveImage(filePath)
            },
            // 拒绝授权时，则进入手机设置页面，可进行授权设置
            fail() {
              Taro.showModal({
                title: '提示',
                content: '保存图片需要您的授权',
                showCancel: true,
                cancelText: '取消',
                cancelColor: '#7f7f7f',
                confirmText: '去设置',
                confirmColor: '#2d8cf0',
                success(modalRes) {
                  if (modalRes.confirm) {
                    Taro.openSetting({
                      success(data) {
                        console.log("openSetting success");
                      },
                      fail(data) {
                        console.log("openSetting fail");
                      }
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
          })
        } else {
          // 已授权则直接进行保存图片
          that.saveImage(filePath)
        }
      },
      fail(res) {
        console.log(res);
      }
    })
  }

  saveImage (filePath) {
    Taro.saveImageToPhotosAlbum({
      filePath: filePath,  // 此为图片路径
      success: (res) => {
        console.log(res)
        Taro.showModal({
          showCancel: false,
          title: '图片已保存到系统相册',
          content: '快去分享给小伙伴们吧~~',
          confirmText: '我知道了',
          confirmColor: '#2d8cf0',
          success() {
          }
        })
      },
      fail: (err) => {
        console.log(err)
      }
    })
  }

  render() {
    const { data } = this.props
    if (!data) return <View />
    return (
      <View>
        <painter palette={data} onImgOK={this.onImgOK} onImgErr={this.onImgErr} />
      </View>
    )
  }
}

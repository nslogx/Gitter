import Taro from '@tarojs/taro'

export default class Poster {
  constructor(config) {
    this.id = config.id
    this.ctx = Taro.createCanvasContext(config.id)
    const { background, scale = 1 } = config
    this.items = config.items
    this.backgroundImage = background.image
    this.width = background.width
    this.height = background.height
    this.scale = scale
  }


  // 背景
  drawBackground = () => {
    const w = this.width * this.scale
    const h = this.height * this.scale
    this.ctx.drawImage(this.backgroundImage, 0, 0, w, h)
    this.ctx.save()
  }

  // 圆形图
  drawCircle = (img, x, y, radius) => {
    this.ctx.beginPath()
    this.ctx.arc(x * this.scale, y * this.scale, radius * this.scale, 0, 2 * Math.PI)
    this.ctx.clip()
    const imgX = (x - radius) * this.scale
    const imgY = (y - radius) * this.scale
    this.ctx.drawImage(img, imgX, imgY, radius * this.scale * 2, radius * this.scale * 2, 0, 0)
    this.ctx.restore()
    this.ctx.save()
  }

  // 文本
  drawText = (text, x, y, fontSize = 14, color = 'black') => {
    const scaleFontSize = fontSize * this.scale
    this.ctx.setFillStyle(color)
    this.ctx.setFontSize(scaleFontSize)
    this.ctx.font = 'normal normal ' + scaleFontSize + 'px sans-serif'
    this.ctx.fillText(text, x * this.scale, y * this.scale)
    this.ctx.save()
  }
  // TODO: drawImage, 画矩形图

  // 遍历所有需要画的元素，渲染canvas
  draw = () => {
    // TODO: download img
    this.drawBackground()
    this.items.forEach((item) => {
      if (item.type === 'text') {
        this.drawText(item.text, item.x, item.y, item.fontSize, item.color)
      } else if (item.type === 'circle') {
        this.drawCircle(item.image, item.x, item.y, item.radius)
      }
    })
    this.ctx.draw(true, function () {
      console.log('图片绘制完成')
    })
  }

  // 生成临时文件
  generateTempImage = () => {
    let num = 1
    let destWidth = this.width * num
    let destHeight = this.height * num
    Taro.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
      destWidth: destWidth,
      destHeight: destHeight,
      canvasId: this.id,
      fileType: 'png',
      success: function (res) {
        Taro.hideLoading()
        Taro.setStorageSync('resultImg', res.tempFilePath)
      },
      fail: function (res) {
        // error('generate_temp_image_fail', res)
      }
    })
  }

  // 保存海报到本地
  save = (resultImg) => {
    //生产环境时 记得这里要加入获取相册授权的代码
    Taro.saveImageToPhotosAlbum({
      filePath: resultImg,
      success(res) {
        Taro.showToast({
          title: '图片已经保存到相册',
          icon: 'none',
          duration: 1500,
          mask: false,
        });
      },
      fail: function (res) {
        // error('save_album_reject', res)
        Taro.openSetting({
          success: (res) => {
            Taro.authorize({
              scope: 'scope.writePhotosAlbum',
              success() {
                // error('authorize_album', res)
              }
            })
          }
        })
      }
    })
  }


}

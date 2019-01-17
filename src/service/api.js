import Taro from '@tarojs/taro'
import { HTTP_STATUS } from '../constants/status'
import { baseUrl } from './config'
import { logError } from '../utils'

const token = 'token b70267ebe467fa7fc31fde9dd35fb9aa9ee9f44c'

export default {
  baseOptions(params, method = 'GET') {
    let { url, data } = params
    console.log('params', params)
    let contentType = 'application/x-www-form-urlencoded'
    contentType = params.contentType || contentType
    const option = {
      url: url.indexOf('http') !== -1 ? url : baseUrl + url,
      data: data,
      method: method,
      header: { 'content-type': contentType, 'Authorization': token },
      success(res) {
        if (res.statusCode === HTTP_STATUS.NOT_FOUND) {
          return logError('api', '请求资源不存在')
        } else if (res.statusCode === HTTP_STATUS.BAD_GATEWAY) {
          return logError('api', '服务端出现了问题')
        } else if (res.statusCode === HTTP_STATUS.FORBIDDEN) {
          return logError('api', '没有权限访问')
        } else if (res.statusCode === HTTP_STATUS.SUCCESS) {
          return res.data
        }
      },
      error(e) {
        logError('api', '请求接口出现问题', e)
      }
    }
    return Taro.request(option)
  },
  get(url, data = '') {
    console.log('url, data', url, data)
    let option = { url, data }
    return this.baseOptions(option)
  },
  post: function (url, data, contentType) {
    let params = { url, data, contentType }
    return this.baseOptions(params, 'POST')
  }
}

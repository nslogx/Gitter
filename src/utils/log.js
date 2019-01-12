// log输出级别分为五种：debug,info,warn,error,fatal。
import Taro from '@tarojs/taro'
import { formatTime } from './common'
import { stringify } from './serialize'

/**
 * （信息）在粗粒度级别上突出强调应用程序的运行过程，打印一些感兴趣的或者重要的信息。
 * @param {string} name  错误名字
 * @param {string} message 错误信息
 * @param {Objec} option  可选 一般信息
 */
export const info = (name, option) => {
  option = stringify(option)
  report(name, option, 'info')
}

/**
 * （警告）表明会出现潜在错误的情形，有些信息不是错误信息，但是也要上报一些提示。
 * @param {string} name 错误名字
 * @param {Object} option 错误信息，通常是 fail 返回的
 */
export const warn = (name, option) => {
  option = stringify(option)
  report(name, option, 'warn')
}

/**
 * （调试）指出细粒度信息事件对调试应用程序是非常有帮助的，主要用于开发过程中打印一些运行信息。
 * @param {string} name  错误名字
 * @param {string} message 错误信息
 * @param {Objec} option  可选 一般信息
 */
export const debug = (name, option) => {
  // todo: 之后增加详细调用 stack
  option = stringify(option)
  report(name, option, 'debug')
}

/**
 *（错误）指出虽然发生错误事件，但仍然不影响系统的继续运行。
 * @param {string} name 错误名字
 * @param {Object} option 错误信息，通常是 fail 返回的
 */
export const error = (name, option) => {
  option = stringify(option)
  report(name, option, 'error')
}

/**
 * （致命）指出每个严重的错误事件将会导致应用程序的退出。
 * @param {string} name 错误名字
 * @param {Object} option 错误信息，通常是 fail 返回的
 */
export const fatal = (name, option) => {
  option = stringify(option)
  report(name, option, 'fatal')
}

const report = (name, option, type = 'info') => {
  try {
    var deviceInfo = Taro.getSystemInfoSync()
    var device = JSON.stringify(deviceInfo)
  } catch (e) {
    console.error('not support getSystemInfoSync api', e.message)
  }
  let time = formatTime(new Date())
  // let user = getApp().globalData.user
  if(type=='info'){
    console.log(time, name, option, device)
  }else{
    console.error(time, name, option, device)
  }
  // getApp().globalData.elkReport.send({ message: { type,time, name, option, user, deviceInfo }, status: 500 })
}

export default { debug, info, warn, error, fatal }

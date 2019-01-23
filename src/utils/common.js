import Taro from '@tarojs/taro'

export const promisify = (func, ctx) => {
  // 返回一个新的function
  return function () {
    // 初始化this作用域
    var ctx = ctx || this;
    // 新方法返回的promise
    return new Promise((resolve, reject) => {
      // 调用原来的非promise方法func，绑定作用域，传参，以及callback（callback为func的最后一个参数）
      func.call(ctx, ...arguments, function () {
        // 将回调函数中的的第一个参数error单独取出
        var args = Array.prototype.map.call(arguments, item => item);
        var err = args.shift();
        // 判断是否有error
        if (err) {
          reject(err)
        } else {
          // 没有error则将后续参数resolve出来
          args = args.length > 1 ? args : args[0];
          resolve(args);
        }
      });
    })
  };
};

// 下载图片
export const downLoadImg = (imgurl, msg) => {
  return new Promise((resolve, reject) => {
    let that = this
    // util.showToast(msg + 'download...')
    wx.downloadFile({
      url: imgurl,
      complete: function (res) {
        if (res.statusCode === 200) {
          resolve(res.tempFilePath)
        } else {
          console.log('downloadstatusCode', res)
          reject(new Error(res))
        }
      },
      fail: function (res) {
        console.log('downloadFilefail', res)
      }
    })
  })
}

export const promiseImage = (url) => {
  return new Promise(function (resolve, reject) {
    resolve(url)
  })
}

export const isChinese = (str) => {
  if (escape(str).indexOf("%u") < 0) return false
  return true
}

export const handleName = (str) => {
  let res = emoj2str(str)
  if (isChinese(res)) {
    res = res.length > 4 ? res.slice(0, 4) + '...' : res
  } else {
    res = res.length > 7 ? res.slice(0, 7) + '...' : res
  }
  return res
}

export const emoj2str = (str) => {
  return unescape(escape(str).replace(/\%uD.{3}/g, ''))
}
/*获取当前页url*/
export const getCurrentPageUrl = () => {
  let pages = getCurrentPages()
  let currentPage = pages[pages.length - 1]
  let url = currentPage.route
  return url
}

export const getSysteminfo = () => {
  try {
    let deviceInfo = wx.getSystemInfoSync()
    const device = JSON.stringify(deviceInfo)
  } catch (e) {
    console.error('not support getSystemInfoSync api', err.message)
  }
  return device
}

export const timeago = dateTimeStamp => {   //dateTimeStamp是一个时间毫秒，注意时间戳是秒的形式，在这个毫秒的基础上除以1000，就是十位数的时间戳。13位数的都是时间毫秒。
  let minute = 1000 * 60;      //把分，时，天，周，半个月，一个月用毫秒表示
  let hour = minute * 60;
  let day = hour * 24;
  let week = day * 7;
  let halfamonth = day * 15;
  let month = day * 30;
  let now = new Date().getTime();   //获取当前时间毫秒
  let diffValue = now - dateTimeStamp;//时间差

  if(diffValue < 0){
    return;
  }
  let minC = diffValue/minute;  //计算时间差的分，时，天，周，月
  let hourC = diffValue/hour;
  let dayC = diffValue/day;
  let weekC = diffValue/week;
  let monthC = diffValue/month;
  let result = null
  if(monthC >= 1 && monthC <= 3){
    result = " " + parseInt(monthC) + " month(s) ago"
  }else if(weekC >= 1 && weekC <= 3){
    result = " " + parseInt(weekC) + " week(s) ago"
  }else if(dayC >= 1 && dayC <= 6){
    result = " " + parseInt(dayC) + " day(s) ago"
  }else if(hourC >= 1 && hourC <= 23){
    result = " " + parseInt(hourC) + " hour(s) ago"
  }else if(minC >= 1 && minC <= 59){
    result =" " + parseInt(minC) + " minute(s) ago"
  }else if(diffValue >= 0 && diffValue <= minute){
    result = "just now"
  }else {
    let datetime = new Date();
    datetime.setTime(dateTimeStamp);
    let Nyear = datetime.getFullYear();
    let Nmonth = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    let Ndate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    let Nhour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
    let Nminute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
    let Nsecond = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
    result = Nyear + "-" + Nmonth + "-" + Ndate + ' ' + Nhour + ':' + Nminute + ':' + Nsecond
  }
  return result;
}

export const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

export const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

export const hasLogin = () => {
  return Taro.getStorageSync('Authorization').length > 0
}

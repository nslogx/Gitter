// 云函数入口文件
const cloud = require('wx-server-sdk')

const Towxml = require('towxml');

const towxml = new Towxml();

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const { func, type, content } = event
  let res
  if (func === 'parse') {
    if (type === 'markdown') {
      res = await towxml.toJson(content || '', 'markdown');
    } else {
      res = await towxml.toJson(content || '', 'html');
    }
  }
  return {
    data: res
  }
}

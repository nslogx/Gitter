const cache = require('memory-cache')

const { fetchRepositories, fetchDevelopers } = require('./fetch')
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { type, language, since } = event
  let res = null;
  let date = new Date()
  if (type === 'repositories') {
    const cacheKey = `repositories::${language || 'nolang'}::${since ||
    'daily'}`;
    const cacheData = await db.collection('repositories').where({
      cacheKey: cacheKey
    }).orderBy('cacheDate', 'desc').get()
    console.log('cacheData', cacheData)
    if (cacheData.data.length !== 0 &&
      ((date.getTime() - cacheData.data[0].cacheDate)  < 1800 * 1000)) {
      res = JSON.parse(cacheData.data[0].content)
    } else {
      res = await fetchRepositories({ language, since });
      await db.collection('repositories').add({
        data: {
          cacheDate: date.getTime(),
          cacheKey: cacheKey,
          content: JSON.stringify(res)
        }
      })
    }
  } else if (type === 'developers') {
    const cacheKey = `developers::${language || 'nolang'}::${since || 'daily'}`;
    const cacheData = await db.collection('developers').where({
      cacheKey: cacheKey
    }).orderBy('cacheDate', 'desc').get()
    if (cacheData.data.length !== 0 &&
      ((date.getTime() - cacheData.data[0].cacheDate)  < 1800 * 1000)) {
      res = JSON.parse(cacheData.data[0].content)
    } else {
      res = await fetchDevelopers({ language, since });
      await db.collection('developers').add({
        data: {
          cacheDate: date.getTime(),
          cacheKey: cacheKey,
          content: JSON.stringify(res)
        }
      })
    }
  }

  return {
    data: res
  }
}

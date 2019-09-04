// 云函数入口文件
const cloud = require('wx-server-sdk')

const { fetchAccessToken, fetchACode } = require('./fetch')

cloud.init({
  env: 'gitter-prod-pkqn3',
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { path, name } = event
  // 通过名称查找是否已经生成小程序码
  const cacheData = await db.collection('code_images')
    .where({
      image_name: `${name}.png`
    })
    .get()
  if (cacheData.data.length !== 0) {
    // 说明该repo/user已经生成过对应的小程序码
    const fileId = cacheData.data[0].fileid
    const fileList = [fileId]
    const result = await cloud.getTempFileURL({
      fileList,
    })
    console.log('cacheData', result.fileList)
    return result.fileList
  } else {
    const access_token = await fetchAccessToken()
    const code = await fetchACode(access_token, path)
    const fileid = await cloud.uploadFile({
      cloudPath: `${name}.png`,
      fileContent: code
    })
    await db.collection('code_images').add({
      data: {
        image_name: `${name}.png`,
        fileid: fileid.fileID
      }
    })
    const fileList = [fileid.fileID]
    const result = await cloud.getTempFileURL({
      fileList,
    })
    console.log('net', result.fileList)
    return result.fileList
  }
}

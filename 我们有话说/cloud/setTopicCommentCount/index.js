// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ =db.command

// 云函数入口函数
exports.main = async (event, context) => {
  // try{
  //   return await db.collection('Topic').doc(event.topicid).update({
  //     data:{
  //       count:event.count
  //     }
  //   })
  // }catch(e){
  //   console.error(e)
  // }
  if(event.operation == 1){
    try {
      return await db.collection('Topic').doc(event.topicid).update({
        data: {
          count: _.inc(1)
        }
      })
    } catch (e) {
      console.error(e)
    }
  }
  else{
    await db.collection('Topic').doc(event.topicid).update({
      data: {
        count: _.inc(-1)
      },
      success(res) {
        return res
      },
      fail(res) {
        return res
      }
    })
  }
  
  
}
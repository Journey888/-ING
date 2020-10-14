// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('Comment').doc(event.commentid).update({
       data:{
         showredpoint:true,
         count: _.inc(1),
         ReplyList: _.push(event.newreply)

       }
     })
   }catch(e){
     console.error(e)
   }
  // db.collection('Comment').doc("d721728a5ec8cf63001aa26814ebda39").update({
  //   data: {
  //     count: 45,
  //   },
  //   success(res) {
  //     return res
  //   },
  //   fail(res) {
  //     return res
  //   }
  // })
  
}
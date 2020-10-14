const db = wx.cloud.database()
const _ = db.command
/**
 * 获取话题列表
 */
// function getTopicList( page,where){
//   return db.collection('Topic')
//   .where(where)
//   .orderBy('date','desc')
//   .skip((page)-1)*10
//   .limit(10)
//   .get()
// }

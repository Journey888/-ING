// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return cloud.database().collection('Collect').aggregate()
  .lookup({
    from:'Topic',
    localField:'topicid',
    foreignField:'_id',
    as:"list"
    }).match({
      _openid: event.openid
    }).end({
    success:function(res){
      return res
    },
    fail(res){
      return res
    }
  })
}
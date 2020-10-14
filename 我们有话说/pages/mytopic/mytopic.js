// pages/mytopic/mytopic.js
const db = wx.cloud.database().collection('Topic')
const dc = wx.cloud.database().collection('Comment')
const dd = wx.cloud.database().collection('Collect')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "我的话题",
    TopicList: [],
    Result: [],
    page: 1,
    nodata: false,
    nomore: false
  },

  goTopicdetail: function (e) {
    wx.navigateTo({
      url: '/pages/topicdetail/topicdetail?topicid=' + e.currentTarget.dataset.topicid,
    })
  },

  delete:function(e){
    let that = this
    let topicid = e.currentTarget.dataset.topicid
    console.log(topicid)
    wx.showModal({
      title: '提示',
      content: '确认删除该话题吗？',
      success(e){
        if(e.confirm){
          that.deleteTopicAndComment(topicid)
        }
      }
    })
  },

  deleteTopicAndComment:function(topicid){
    let that = this
    db.doc(topicid).remove({
      success(res){
         console.log("删除成功",res)
         that.onPullDownRefresh()
      },
      fail(res){
        console.log("删除失败",res)
      }
    })
    dc.where({
      topicid:topicid
    }).remove({
      success(res) {
        console.log("删除成功", res)
      },
      fail(res) {
        console.log("删除失败", res)
      }
    })
    dd.where({
      topicid: topicid
    }).remove({
      success(res) {
        console.log("删除成功", res)
      },
      fail(res) {
        console.log("删除失败", res)
      }
    })
    wx.showToast({
      title: '删除成功',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      openid: options.openid
    })
    this.getTopicList(options.openid)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this
    that.setData({
      TopicList: [],
      page: 1,
      nomore: false,
      nodata: false
    })
    that.getTopicList(that.data.openid)
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getTopicList(this.data.type)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getTopicList: function (openid) {
    wx.showLoading({
      title: '加载中...',
    })
    let that = this
    let page = that.data.page
    if (that.data.nomore) {
      wx.hideLoading()
      return
    }
    db.where({
      _openid: openid
    }).orderBy('date', 'desc')
      .skip((page - 1) * 8)
      .limit(8)
      .get({
        success(res) {
          console.log(res.data, "查询成功")
          that.setData({
            Result: res.data
          })
          if (that.data.Result.length == 0) {
            that.setData({
              nomore: true
            })
            if (page == 1) {
              that.setData({
                nodata: true
              })
            }
          }
          else {
            that.setData({
              page: page + 1,
              TopicList: that.data.TopicList.concat(that.data.Result)
            })
          }
        },
        fail(res) {
          console.log("查询失败")
        }
      })
    wx.hideLoading()
  }
})
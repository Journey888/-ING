// pages/mycollection/mycollection.js
const db = wx.cloud.database().collection('Collect')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "我的收藏",
    nodata: false,
    TopicList: [],
  },
  goTopicdetail: function (e) {
    wx.navigateTo({
      url: '/pages/topicdetail/topicdetail?topicid=' + e.currentTarget.dataset.topicid,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      openid: options.openid
    })
    this.getCollectList(options.openid)

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
    })
    that.getCollectList(that.data.openid)
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getCollectList: function (openid) {
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name:"getcollection",
      data:{
        openid:openid
      },
      success(res){
        console.log("聚合查询成功",res)
        that.setData({
          //TopicList:res.result.list
          TopicList: res.result.list.reverse()
        })
        // var X = that.data.TopicList
        // X.reverse()
        // console.log(X)
        //that.data.TopicList.reverse()
        if(that.data.TopicList.length==0){
          that.setData({
            nodata:true
          })
        }
      },
      fail(res){
        console.log(res)
      }
    })
   
    wx.hideLoading()
  }
})
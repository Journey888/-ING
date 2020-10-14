// pages/mine/mine.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      //hasUserInfo: true
    })
  },

  goMyTopic:function(){
    wx.navigateTo({
      url: '/pages/mytopic/mytopic?openid=' + this.data.openid,
    })
  },

  goMyCollection: function () {
    wx.navigateTo({
      url: '/pages/mycollection/mycollection?openid=' + this.data.openid,
    })
  },

  goMyReply: function () {
    wx.navigateTo({
      url: '/pages/myreply/myreply?openid=' + this.data.openid,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
    })

    let that = this
    wx.cloud.callFunction({
      name: "openId",
      success(res) {
        console.log("请求云函数成功", res)
        that.setData({
          openid: res.result.openid,
        })
      },
      fail(res) {
        console.log("请求云函数失败", res)
      }
    })
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

  }
})
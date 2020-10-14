// pages/square/square.js
const db = wx.cloud.database().collection('Topic')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    type:"",
  },

  create:function(e){
    if (app.globalData.userInfo == null) {
      wx.showToast({
        title: '未登录',
      })
    }
    else{
      wx.navigateTo({
        url: '/pages/create/create',
      })
    }
  },

  goTopicdetail: function (e) {
    wx.navigateTo({
      url: '/pages/topicdetail/topicdetail?topicid=' + e.currentTarget.dataset.topicid,
    })
  },


  goTopic:function(e){
    this.setData({
      type: e.currentTarget.dataset.type
    })
    wx.navigateTo({
      url: '/pages/topiclist/topiclist?type='+this.data.type,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    this.getRecomment()

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
    this.getRecomment()
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
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  getRecomment: function () {
    let that = this
    db.orderBy('date', 'desc')
      .skip(0)
      .limit(1)
      .get({
        success(res) {
          console.log(res.data, "查询成功")
          that.setData({
            Topic: res.data
          })
        },
        fail(res) {
          console.log("查询失败", res)
        }
      })
  }

})



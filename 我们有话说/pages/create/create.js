// pages/create/create.js
const DB = wx.cloud.database().collection("Topic")
const app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lastarea1:50,
    lastarea2: 6,
    lastarea3: 6,
    alldone:true,
    hint:"",
    select: false,
    topictype:"",
    type:"",
    negative:"",
    positive:"",
    content:"",
    date:""
  },

  bindShowMsg(){
    this.setData({
      select:!this.data.select
    })
  },
  mySelect(e){
    var name = e.currentTarget.dataset.name
    this.setData({
      topictype:name,
      select:false,
      type: e.currentTarget.dataset.type
    })
  },

  contentinput:function(e){
    var value = e.detail.value.length
    var lastarea1 = 50-value
    this.setData({
      content:e.detail.value,
      lastarea1:lastarea1
    })
  },

  negativeinput:function(e){
    var value = e.detail.value.length
    var lastarea3 = 6 - value
    this.setData({
      negative:e.detail.value,
      lastarea3: lastarea3
    })
  },

  positiveinput: function (e) {
    var value = e.detail.value.length
    var lastarea2 = 6 - value
    this.setData({
      positive: e.detail.value,
      lastarea2: lastarea2
    })
  },

  submit:function(e){
    if(this.data.type == "")
    {
      this.setData({
        alldone:false,
        hint:"请选择话题类型"
      })
    }
    else if(this.data.content == "")
    {
      this.setData({
        alldone: false,
        hint: "请输入话题内容"
      })
    }
    else if (this.data.positive == "") {
      this.setData({
        alldone: false,
        hint: "请设置正方观点"
      })
    }
    else if (this.data.negative == "") {
      this.setData({
        alldone: false,
        hint: "请设置反方观点"
      })
    }
     else{
       var DATE = util.formatTime(new Date())
       this.setData({
         date:DATE
       })
       DB.add({
         data:{
           type:this.data.type,
           content:this.data.content,
           positive:this.data.positive,
           negative:this.data.negative,
           ownerid:this.data.openid,
           ownerurl:this.data.userInfo.avatarUrl,
           ownernickname:this.data.userInfo.nickName,
           date:this.data.date,
           count:0
         },
         success(res) {
           console.log("添加成功", res)
           wx.switchTab({
             url: '/pages/square/square',
           })
         },
         fail(res) {
           console.log("添加失败", res)
         }
       })
     }
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
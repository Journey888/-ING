// pages/topiclist/topiclist.js
const db = wx.cloud.database().collection('Topic')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    title:"",
    TopicList: [],
    Result:[],
    page: 1,
    type: "",
    nodata: false,
    nomore: false
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
      type: options.type
    })
   this.getTopicList(options.type)
    switch (options.type){
     case '0': this.setData({
       title: "聚焦西大"
     })
     break
     case '1': this.setData({
       title: "青年生活"
     })
     break
     case '2': this.setData({
       title: "共战疫情"
     })
     break
     case '3': this.setData({
       title: "社会热议"
     })
     break
   }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this
    that.setData({
      TopicList:[],
      page:1,
      nomore:false,
      nodata:false
    })
    this.getTopicList(this.data.type)
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getTopicList(this.data.type)
  },

  getTopicList: function (type) {
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
      type: type
    }).orderBy('date','desc')
      .skip((page-1) * 8)
      .limit(8)
    .get({
      success(res){
        console.log(res.data,"查询成功")
        that.setData({
          Result:res.data
        })
        if(that.data.Result.length == 0){
          that.setData({
            nomore:true
          })
          if(page == 1){
            that.setData({
              nodata:true
            })
          }
        }
        else{
          that.setData({
            page:page+1,
            TopicList:that.data.TopicList.concat(that.data.Result)
          })
        }
      },
      fail(res){
        console.log("查询失败")
      }
    })
    wx.hideLoading()
  },
})
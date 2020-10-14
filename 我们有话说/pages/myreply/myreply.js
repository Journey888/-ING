// pages/myreply/myreply.js
const DB = wx.cloud.database().collection("Topic")
const DC = wx.cloud.database().collection("Comment")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    Result: [],
    nodata: false,
    nomore: false,
    CommentList: [],
    INDEX: 0,
    commentcount:0,
    topicid:"",
  },

  godetail: function (e) {
    wx.navigateTo({
      url: '/pages/topicdetail/topicdetail?topicid=' + e.currentTarget.dataset.topicid,
    })
  },

  delete: function (e) {
    let that = this
    let commentid = e.currentTarget.dataset.commentid
    that.setData({
      topicid: e.currentTarget.dataset.topicid
    })
    DB.doc(e.currentTarget.dataset.topicid).get({
      success(res) {
        console.log(res)
        that.setData({
          commentcount:res.data.count
        })
      },
      fail(res) {
        console.log(res, "查询话题失败")
      }
    })
    wx.showModal({
      title: '提示',
      content: '确认删除该评论吗？',
      success(e) {
        if (e.confirm) {
          that.deleteComment(commentid)
        }
      }
    })
  },

  deleteComment: function (commentid) {
    let that = this
    that.data.commentcount = that.data.commentcount -1
    DC.doc(commentid).remove({
      success(res) {
        console.log("删除成功", res)
        that.onPullDownRefresh()
        wx.showToast({
          title: '删除成功',
        })
      },
      fail(e) {
        console.log("删除失败", res)
      }
     })
       
    wx.cloud.callFunction({
      name: "setTopicCommentCount",
      data: {
        topicid: that.data.topicid,
        count: that.data.commentcount
      },
      success(res) {
        console.log(res, "更新成功")
      },
      fail(res) {
        console.log(res, "更新失败")
      }
    })
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      openid: options.openid
    })
    this.getCommentList(options.openid)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 评论弹出层动画创建
    this.animation = wx.createAnimation({
      duration: 400, // 整个动画过程花费的时间，单位为毫秒
      timingFunction: "ease", // 动画的类型
      delay: 0 // 动画延迟参数
    })

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
      CommentList: [],
      page: 1,
      nomore: false,
      nodata: false
    })
    this.getCommentList(this.data.openid)
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getCommentList(this.data.openid)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getCommentList:function(openid){
    wx.showLoading({
      title: '加载中...',
    })
    let that = this
    let page = that.data.page
    if (that.data.nomore) {
      wx.hideLoading()
      return
    }
    DC.where({
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
              CommentList: that.data.CommentList.concat(that.data.Result)
            })
          }
        },
        fail(res) {
          console.log("查询失败")
        }
      })
    wx.hideLoading()
  },
  showreply: function (e) {
    this.setData({
      INDEX: e.currentTarget.dataset.index ,
      newreplylength: e.currentTarget.dataset.commentitem.ReplyList.length
    })
    //console.log(this.data.INDEX)
    let i = this.data.INDEX
    this.setData({
      ['CommentList[' + i + '].showredpoint']:false
    })
    DC.doc(e.currentTarget.dataset.commentitem._id).update({
      data:{
        showredpoint: false
      },
      success(res){
        console.log(res,"更新成功")
      },
      fail(res){
        console(res,"更新失败")
      }
    })

    // 设置动画内容为：使用绝对定位显示区域，高度变为100%
    this.animation.bottom("0rpx").height("100%").step()
    this.setData({
      talksAnimationData: this.animation.export()
    })
  },
  hidereply: function () {    // 设置动画内容为：使用绝对定位隐藏整个区域，高度变为0
    this.animation.bottom("-100%").height("0rpx").step()
    this.setData({
      talksAnimationData: this.animation.export()
    })
  },  
})
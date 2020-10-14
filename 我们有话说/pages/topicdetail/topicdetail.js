// pages/topicdetail/topicdetail.js
const regeneratorRuntime = require('../../utils/runtime.js');
const DB = wx.cloud.database().collection("Topic")
const DC = wx.cloud.database().collection("Comment")
const DD = wx.cloud.database().collection("Collect")
const app = getApp()
var util = require('../../utils/util.js')
let collect = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // HaveComment:[],
    showModal: false,
    topic:{},
    CommentList:[],
    lastarea: 100,
    standpoint: "",
    commentcontent: "",
    replycontent:"",
    alldone: true,
    hint: "",
    page:1,
    Result: [],
    nodata: false,
    nomore: false,
    collectImage:"",
    newReply:{},
    newComment:{},
    newreplylistlength:0,
    INDEX:0,
    topNum:0,
  },

  onPageScroll:function(e){
    //console.log(e)
    if(e.scrollTop>100){
      this.setData({
        backtopstatus:true
      })
    }
    else{
      this.setData({
        backtopstatus: false
      })
    }
  },
 

  backtop:function(e){
    wx.pageScrollTo({
      scrollTop: 0,
    })
  },

  collect:function(){
    if (app.globalData.userInfo == null) {
      wx.showToast({
        title: '未登录',
      })
    }
    else {
      let that = this
      collect = !collect
      let DATE = util.formatTime(new Date())
      that.setData({
        date: DATE
      })
      if(collect){
        wx.showToast({
          title: '收藏成功',
        })
        DD.add({
          data:{
            topicid:that.data.topic._id,
            date:that.data.date
          },
          success(res){
            console.log("添加成功",res)
          },
          fail(res){
            console.log("添加失败",res)
          }
        })
      }
      else{
        wx.showToast({
          title: '取消收藏',
        })
        DD.where({
          _openid: that.data.openid,
          topicid: that.data.topic._id
        }).remove({
          success(res){
            console.log("取消收藏成功",res)
          },
          fail(res){
            console.log("取消收藏失败",res)
          }
        })
      }
      that.setData({
        collectImage:collect?"/image/collect.png" :"/image/uncollect.png"
      }) 
    }
  },

  back: function () {
    this.setData({
      showModal: false
    })
  },

  join:function(e){
    if (app.globalData.userInfo == null){
      wx.showToast({
        title: '未登录',
      })
    }
    else{
      this.setData({
        showModal: true
      })
    } 
  },

  catch: function (e) {
    this.setData({
      standpoint: e.detail.value
    })
  },

  commentinput: function (e) {
    var value = e.detail.value.length
    var lastarea = 100 - value
    this.setData({
      commentcontent: e.detail.value,
      lastarea: lastarea
    })
  },

  replyinput:function(e){
    if (app.globalData.userInfo == null) {
      wx.showToast({
        title: '未登录',
      })
    }
    else{
      this.setData({
        replycontent: e.detail.value
      })
    }
  },

  delete:function(e){
    if (app.globalData.userInfo == null) {
      wx.showToast({
        title: '未登录',
      })
    }
    else {
      let that = this
      let commentatorid = e.currentTarget.dataset.commentatorid
      let createdate = e.currentTarget.dataset.date
      let index = e.currentTarget.dataset.index
      console.log(commentatorid,createdate,index)
      wx.showModal({
        title: '提示',
        content: '确认删除该评论吗？',
        success(e) {
          if (e.confirm) {
            that.setData({
              'topic.count': that.data.topic.count - 1,
            })
            for(var i = 0; i < that.data.CommentList.length; i++){
              if(i == index){
                let commentlist = that.data.CommentList
                commentlist.splice(i,1)
                console.log(commentlist,index,i)
                that.setData({
                  CommentList:commentlist
                })
                break
              }
            }
            that.deleteComment(commentatorid,createdate)
          }
        }
      })
    }
  },

  deleteComment:function(commentatorid,createdate){
    let that = this
    DC.where({
      commentatorid:commentatorid,
      date:createdate
      }).remove({
      success(res) {
        console.log("删除成功", res)
        wx.showToast({
          title: '删除成功',
        })
        // that.setData({
        //   "topic.count": that.data.topic.count - 1
        // })
        wx.cloud.callFunction({
          name:"setTopicCommentCount",
          data:{
            topicid: that.data.topic._id,
            operation: 0   //0代表count-1,1代表count+1
            //count: that.data.topic.count
          },
          success(res){
            console.log(res,"更新成功")
            //that.onPullDownRefresh()
          },
          fail(res){
            console.log(res,"更新失败")
          }
        })
      },
      fail(e) {
        console.log("删除失败", res)
      }
    })
  },
  
  replysubmit:function(e){
    let that = this
    let i = that.data.INDEX
    if(this.data.replycontent != ""){
      let DATE = util.formatTime(new Date())
      that.setData({
        ['CommentList['+i+'].count']: that.data.CommentList[that.data.INDEX].count + 1,
        newReply:{
          replycontent: that.data.replycontent,
          replierNickname: that.data.userInfo.nickName,
          replierUrl: that.data.userInfo.avatarUrl,
          replierid: that.data.openid,
          date: DATE,
        }
      })
      that.setData({
        replycontent: ""
      })
      let reply = [];
      reply = reply.concat(that.data.CommentList[that.data.INDEX].ReplyList);
      reply.push(that.data.newReply)
      that.setData({
        newreplylength: that.data.newreplylength + 1,
        ['CommentList[' + i + '].ReplyList']:reply
      })
      wx.showToast({
        title: '回复成功',
      })
      // console.log(that.data.CommentList[that.data.INDEX]._id, that.data.CommentList[that.data.INDEX].count)
      
      wx.cloud.callFunction({
        name:"updateReply",
        data:{
          commentid: that.data.CommentList[that.data.INDEX]._id,
          newreply:that.data.newReply
        },
        success(res) {
          console.log(res, "更新成功")
        },
        fail(res) {
          console.log(res, "更新失败")
        }
      })
    }
    
  },


  submit: function (e) {
    if (this.data.standpoint == "") {
      this.setData({
        alldone: false,
        hint: "请选择您支持的观点"
      })
    }
    else if (this.data.commentcontent == "") {
      this.setData({
        alldone: false,
        hint: "请填写您支持该观点的原因"
      })
    }
    else {
      this.setData({
        showModal: false
      })
      let DATE = util.formatTime(new Date())
      this.setData({
        date: DATE
      })
      let that = this
      let CContent = that.data.commentcontent
      that.setData({
        'topic.count': that.data.topic.count+1,
        newComment:{
          topicid: this.data.topic._id,
          standpoint: this.data.standpoint,
          commentcontent: CContent,
          commentatorNickname: this.data.userInfo.nickName,
          commentatorUrl: this.data.userInfo.avatarUrl,
          commentatorid: this.data.openid,
          date: this.data.date,
          count: 0,
          ReplyList: [],
          showredpoint: false
        },
        lastarea: 100,
        commentcontent: "",
      })
      
      let commentlist = []
      commentlist = that.data.CommentList
      commentlist.reverse()
      commentlist.push(that.data.newComment)
      commentlist.reverse()
      that.setData({
        CommentList:commentlist
      })
      wx.pageScrollTo({
        scrollTop: 0,
      })

      DC.add({
        data: {
          topicid: this.data.topic._id,
          standpoint: this.data.standpoint,
          commentcontent: CContent,
          commentatorNickname: this.data.userInfo.nickName,
          commentatorUrl: this.data.userInfo.avatarUrl,
          commentatorid: this.data.openid,
          date: this.data.date,
          count:0,
          ReplyList:[],
          showredpoint:false
        },
        success(res) {
          console.log("添加成功", res)
          
          wx.cloud.callFunction({
            name: "setTopicCommentCount",
            data: {
              topicid: that.data.topic._id,
              operation: 1  //0代表count-1,1代表count+1
              //count: that.data.topic.count
            },
            success(res) {
              console.log(res, "更新成功")
              //that.onPullDownRefresh()
            },
            fail(res) {
              console.log(res, "更新失败")
            }
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
    let that = this
    that.setData({
      topicid:options.topicid
    })
     DB.doc(options.topicid).get({
      success(res) {
        console.log("查询成功", res)
        that.setData({
          topic: res.data
        })
         wx.cloud.callFunction({
          name: "openId",
          success(res) {
            console.log("请求云函数成功", res)
            that.setData({
              openid: res.result.openid,
            })
            DD.where({
              _openid: that.data.openid,
              topicid: that.data.topic._id
            }).get({
              success(res) {
                console.log("查询收藏成功", res)
                that.setData({
                  Havecollected: res.data
                })
                that.setData({
                  collectImage: that.data.Havecollected.length == 0 ? "/image/uncollect.png" : "/image/collect.png"
                })
                collect = that.data.Havecollected.length == 0 ? false : true
              }
            })
          },
          fail(res) {
            console.log("查询失败", res)
          }
        })
          },
          fail(res) {
            console.log("请求云函数失败", res)
          }
        })
        //console.log(that.data.topic._id)
    //     DD.where({
    //       _openid: options.openid,
    //       topicid: that.data.topic._id
    //     }).get({
    //       success(res) {
    //         console.log("查询收藏成功", res)
    //         that.setData({
    //           Havecollected: res.data
    //         })
    //         that.setData({
    //           collectImage: that.data.Havecollected.length == 0 ? "/image/uncollect.png" : "/image/collect.png"
    //         })
    //         collect = that.data.Havecollected.length == 0 ? false : true
    //       }
    //     })
    //   },
    //   fail(res) {
    //     console.log("查询失败", res)
    //   }
    // })

    that.setData({
      userInfo: app.globalData.userInfo,
    })

    // await wx.cloud.callFunction({
    //   name: "openId",
    //   success(res) {
    //     console.log("请求云函数成功", res)
    //     that.setData({
    //       openid: res.result.openid,
    //     })
    //   },
    //   fail(res) {
    //     console.log("请求云函数失败", res)
    //   }
    // })
    //await console.log(that.data.openid)
    //await console.log(that.data.topic._id)
    // await DD.where({
    //   _openid: that.data.openid,
    //   // topicid: that.data.topic._id
    //   topicid: that.data.topic._id
    // }).get({
    //   success(res){
    //     console.log("查询收藏成功",res)
    //     that.setData({
    //       Havecollected:res.data
    //     })    
    //     that.setData({
    //       collectImage: that.data.Havecollected.length == 0 ? "/image/uncollect.png":"/image/collect.png"
    //     })
    //     collect=that.data.Havecollected.length == 0? false : true   
    //   }
    // })

    this.getCommentList(options.topicid)
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
    that.getCommentList(this.data.topic._id)
    DB.doc(that.data.topicid).get({
      success(res) {
        console.log("查询成功", res)
        that.setData({
          "topic.count": res.data.count
        })
      }
    })
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getCommentList(this.data.topic._id)
  },

  
  getCommentList: function (topicid) {
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
      topicid: topicid
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

  onReady: function () {
    // 评论弹出层动画创建
    this.animation = wx.createAnimation({
      duration: 400, // 整个动画过程花费的时间，单位为毫秒
      timingFunction: "ease", // 动画的类型
      delay: 0 // 动画延迟参数
    })
  },
  showreply: function (e) {
    console.log(e)
    this.setData({
      INDEX : e.currentTarget.dataset.index ,
      newreplylength:e.currentTarget.dataset.commentitem.ReplyList.length
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
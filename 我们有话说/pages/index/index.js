Page({
  data: {
    talks: []
  },
  onLoad: function () {

   },
  onReady: function () {    
    // 评论弹出层动画创建
    this.animation = wx.createAnimation({
      duration: 400, // 整个动画过程花费的时间，单位为毫秒
      timingFunction: "ease", // 动画的类型
      delay: 0 // 动画延迟参数
    })
   },
  showTalks: function () {
    // 加载数据
    this.loadTalks();    // 设置动画内容为：使用绝对定位显示区域，高度变为100%
    this.animation.bottom("0rpx").height("100%").step()
    this.setData({
      talksAnimationData: this.animation.export()
    })
   },
  hideTalks: function () {    // 设置动画内容为：使用绝对定位隐藏整个区域，高度变为0
    this.animation.bottom("-100%").height("0rpx").step()
    this.setData({
      talks: [],
      talksAnimationData: this.animation.export()
    })

   },  // 加载数据

   loadTalks: function () {    // 随机产生一些评论

    wx.showNavigationBarLoading();
    var that = this;
    var talks = [];
     var faces = ['/image/11.jpg', '/image/11.jpg', '/image/11.jpg'];
    var names = ['贝贝', '晶晶', '欢欢', '妮妮'];
    var contents = ['IT实战联盟很不错的', '是的', '楼上说的对'];

    talks = talks.concat(this.data.talks);    // 随机产生10条评论

    for (var i = 0; i < 10; i++) {

      talks.push({
        avatarUrl: faces[Math.floor(Math.random() * faces.length)],
        nickName: names[Math.floor(Math.random() * names.length)],
        content: contents[Math.floor(Math.random() * contents.length)],
        talkTime: '刚刚'

      });

    }
    this.setData({
      talks: talks,
      talksAnimationData: that.animation.export()

    })

    wx.hideNavigationBarLoading();

   },

  onScrollLoad: function () {    // 加载新的数据
    this.loadTalks();
   },

})
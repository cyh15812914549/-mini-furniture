// pages/home/index.js
const app = getApp(),
wxParse = require("../../wxParse/wxParse.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mainColor: app.globalData.mainColor,
    ifDisplayJXSData: app.globalData.ifDisplayJXSData,
    categoryCut: [

    ],
    threeLink: [
      { name: '店主推产品', imageUrl: '../../assets/images/recommend.png'},
      { name: '店套房系列', imageUrl: '../../assets/images/house.png'},
      { name: '店新款产品', imageUrl: '../../assets/images/new.png'},
      { name: '店促销活动', imageUrl: '../../assets/images/promotion.png'},
    ],
    introZoneTitle: '',//热门商品标题
    profileTitle: '',//公司简介标题
    profileContent: '&lt;p&gt;test&lt;/p&gt;&lt;p&gt;&lt;br/&gt;&lt;/p&gt;',//公司简介内容
    bannerImages: [],//经销商轮播图
    summary: '',//经销商简介
    logoFilePath: '',//经销商LOGO
    introZoneGoods: [], //精品推荐
    JXSName: '',
    JXSAddress: '',



    /**
     * 走马灯
     */
    notice: '',
    marqueePace: .5, //滚动速度
    marqueeDistance: 0, //初始滚动距离
    marqueeDistance2: 0,
    marquee2copy_status: false,
    marquee2_margin: 60,
    size: 14,
    orientation: 'left', //滚动方向
    interval: 20, // 时间间隔
    testText: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      mainColor: app.globalData.mainColor,
      ifDisplayJXSData: app.globalData.ifDisplayJXSData
    })

    // 设置navbar标题、颜色
    app.setNavigationBar();

    this.init()

  },

  init(){

    let that = this

    app._get('index/page', {}, function (result) {

      if (!!result.data.n) {
        that.setData({
          notice: result.data.n
        })
      }
      console.log(result)
      let c = result.data.c
      let profileContent = c.profile_content

      that.setData({
        categoryCut: c.cat,
        introZoneTitle: c.intro_zone_title,
        profileTitle: c.profile_title,
        introZoneGoods: c.intro_zone_goods,
        profileContent: profileContent
      })



      if (app.globalData.ifDisplayJXSData){
        let s = result.data.s
        app.globalData.JXSTopNav = s.cat
        app.globalData.poster = s.poster
        that.setData({
          bannerImages: s.slides,
          summary: s.summary,
          logoFilePath: s.logo_file_path,
          JXSName: s.name,
          JXSAddress: s.address
        })
      }


      if (profileContent.length > 0) {
        wxParse.wxParse('content', 'html', that.data.profileContent, that, 0);
      }
    });
  },

  goToShop(e){
    if (e.currentTarget.dataset.item){
      let item = JSON.stringify(e.currentTarget.dataset.item);
      let labelName =  e.currentTarget.dataset.item.name;

      switch (labelName) {
        case '店主推产品':
          wx.navigateTo({
            url: '/pages/shop/main-push'
          });
          break;
        case '店套房系列':
          wx.navigateTo({
            url: '/pages/home/suiteSeries'
          });
          break;
        case '店新款产品':
          wx.navigateTo({
            url: '/pages/shop/new-pattern'
          });
          break;
        case '店促销活动':
          wx.navigateTo({
            url: '/pages/shop/promotion'
          });
          break;
        default:
          break
      }

    } else {
      wx.navigateTo({
        url: '/pages/shop/index'
      })
    }
  },

  checkDetails(e){
    wx.navigateTo({
      url: '/pages/goods/index?goods_id=' + e.currentTarget.dataset.goodsid
    })
  },

  goToCategory(e){
    let index = e.currentTarget.dataset.index
    wx.setStorageSync('categoryIndex', index);
    wx.switchTab({
      url: '/pages/category/index'
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

    //原生公告栏实现
    // < !--    < view class="marquee_text" style = "{{orientation}}:{{marqueeDistance}}px;font-size: {{size}}px;" > -->
    // < !--{{ notice }
    //   }-- >
    // < !--    </view> -->
    // setTimeout(()=>{
    //   if (this.data.notice){
    //     // 页面显示
    //     let vm = this;
    //     console.log(vm.data.notice)
    //     let length = vm.data.notice.length * vm.data.size; //文字长度
    //     let windowWidth = wx.getSystemInfoSync().windowWidth; // 屏幕宽度
    //     vm.setData({
    //       length: length,
    //       windowWidth: windowWidth,
    //       marquee2_margin: length < windowWidth ? windowWidth - length : vm.data.marquee2_margin //当文字长度小于屏幕长度时，需要增加补白
    //     });
    //     vm.run(); // 水平一行字滚动完了再按照原来的方向滚动
    //   }
    // },700)
    // run() {
  //   let vm = this;
  //   let interval = setInterval(function() {
  //     if (-vm.data.marqueeDistance < vm.data.length) {
  //       vm.setData({
  //         marqueeDistance: vm.data.marqueeDistance - vm.data.marqueePace,
  //       });
  //     } else {
  //       clearInterval(interval);
  //       vm.setData({
  //         marqueeDistance: vm.data.windowWidth
  //       });
  //       vm.run();
  //     }
  //   }, vm.data.interval);
  // },
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
    this.init()
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
    return {
      title: '小陈家具店',
      path: "/pages/home/index"
    }
  }
})

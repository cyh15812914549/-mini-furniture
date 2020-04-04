// pages/shop/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft: 0,
    typeLists: app.globalData.JXSTopNav,
    isDisplayNav: true,
    ifDisplayPoster: false,

    goodsLists: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      typeLists: app.globalData.JXSTopNav
    })
    wx.setNavigationBarTitle({
      title: app.globalData.JXSShopName
    })

    let loopNum = 0
    for (let key in app.globalData.JXSTopNav) {
      this.setData({
        TabCur: key
      })
      loopNum++
      if(loopNum === 1){
        break;
      }
    }
    this.init()

    // 设置navbar标题、颜色
    app.setNavigationBar();


  },


  init(){
    this.getGoodsList(1,this.data.TabCur,0,'')
  },


  /**
   * 获取商品列表
   */
  getGoodsList(page, category_id,fetch_company,search) {
    let _this = this;
    app._get('goods/lists', {
      page: page,
      category_id: category_id,
      fetch_company: fetch_company,
      search: search,
      sortType: '',
      sortPrice: false
    }, function (result) {
      _this.setData({
        goodsLists: result.data.list.data
      })
    });
  },


  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    });
    this.getGoodsList(1,this.data.TabCur,0,'')
  },

  checkDetails(e){
    wx.navigateTo({
      url: '/pages/goods/index?goods_id=' + e.currentTarget.dataset.goodsid
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
      path: "/pages/shop/index"
    }
  }
})

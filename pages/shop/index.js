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

    goodsLists: [],
    totalPage: 0, //总页数
    pageNo: 1,//当前页数
    showGrid: true,
    hiddenList: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.JXSTopNav,"1");
    this.setData({
      typeLists: app.globalData.JXSTopNav
    });
    wx.setNavigationBarTitle({
      title: app.globalData.JXSShopName
    });

    let loopNum = 0;
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

  ifDisplayGrid(){
    this.setData({
      showGrid: !this.data.showGrid
    })
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
      let total = result.data.list.total;
      let totalPage = (parseInt(total) % 15) === 0 ? parseInt(total) / 15 : Math.floor(parseInt(total) / 15) + 1;
      _this.setData({
        goodsLists: _this.data.goodsLists.concat(result.data.list.data),
        totalPage: totalPage
      })
    });
  },


  tabSelect(e) {
    this.data.goodsLists = []
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      showGrid: !this.data.showGrid
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
    let pageNo = this.data.pageNo + 1;
    if (pageNo > this.data.totalPage) {
      console.log(1)
      this.setData({
        hiddenList: false
      })
    } else {
      console.log(2)
      this.setData({
        pageNo: pageNo
      });
      this.getGoodsList(pageNo, this.data.TabCur,0,'')
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: app.globalData.JXSShopName,
      path: "/pages/home/index?idt=" + app.globalData.JXSId + '&page=' + '/pages/shop/index'
          + '&JXSTopNav=' + JSON.stringify(app.globalData.JXSTopNav) + '&JXSShopName=' + app.globalData.JXSShopName
    }
  }
})

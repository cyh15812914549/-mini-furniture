// pages/category/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 列表高度
    scrollHeight: 0,
    curIndex: 0,
    inputShowed: false,
    inputVal: '',
    optionsIndex: -1,
    GSCategoryLists: [],
    categoryId: 0,//当前分类的id
    goodsLists: [],
    totalPage: 0, //总页数
    pageNo: 1,//当前页数
    hiddenList: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 设置分类列表高度
    this.setListHeight();

    // 设置navbar标题、颜色
    app.setNavigationBar();
  },

  init(){
    let categoryIndex = wx.getStorageSync('categoryIndex')
    let _this = this,
        GSCategory = [];
    if (wx.getStorageSync('curIndex')) {
      _this.setData({
        curIndex: wx.getStorageSync('curIndex'),
        pageNo: 1
      });
    }else {
      _this.setData({
        curIndex: 0,
        pageNo: 1
      });
    }

    _this.data.GSCategoryLists = [{id: 0, name: "全部"}]
    _this.data.goodsLists = []
    app._get('index/page', {}, function (result) {
      console.log(result)
      let c = result.data.c
      GSCategory = c.cat
      if (categoryIndex){
        let arr = GSCategory.filter(item=>item.id===categoryIndex)
        _this.setData({
          GSCategoryLists: arr[0].child
        })
      } else {
        GSCategory.map(item=>{
          _this.setData({
            GSCategoryLists: _this.data.GSCategoryLists.concat(item.child)
          })
        })
      }
      wx.nextTick(() => {
        if (_this.data.GSCategoryLists.length > 0) {
          if (wx.getStorageSync('curIndex')){
            _this.getGoodsList(1, _this.data.GSCategoryLists[wx.getStorageSync('curIndex')].id, 1, '')
          } else {
            _this.getGoodsList(1, _this.data.GSCategoryLists[0].id, 1, '')
          }
        }
      })
    });


  },

  /**
   * 设置分类列表高度
   */
  setListHeight: function() {
    let that = this
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          scrollHeight: res.windowHeight - 47,
        });
      }
    });
  },

  selectNav(e){
    this.data.goodsLists = []
    let index = e.currentTarget.dataset.index,
        id = e.currentTarget.dataset.id
    this.setData({
      curIndex: index,
      categoryId: id
    })
    wx.setStorageSync('curIndex', index);
    this.getGoodsList(1,id,1,'')
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
      console.log(result.data.list.data)
      _this.setData({
        goodsLists: _this.data.goodsLists.concat(result.data.list.data),
        totalPage: totalPage
      })
    });
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },

  hideInput: function () {
    this.data.goodsLists = []
    this.getGoodsList(1,this.data.categoryId,1,'')
    this.setData({
      inputShowed: false
    });
  },

  clearInput: function () {
    this.data.goodsLists = []
    this.getGoodsList(1,this.data.categoryId,1,'')
  },

  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    })
    this.data.goodsLists = []
    this.getGoodsList(1,this.data.categoryId,1,e.detail.value)
  },

  checkDetails(e){
    wx.navigateTo({
      url: '/pages/goods/index?goods_id=' + e.currentTarget.dataset.goodsid + '&ifCompany=1'
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
    this.init()

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

  // scroll-view上拉加载
  loadMore () {
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
      this.getGoodsList(pageNo, this.data.categoryId, 1, this.data.inputVal)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '轻奢系列',
      path: "/pages/home/index?idt=" + app.globalData.JXSId + '&page=' + '/pages/category/index'
    }
  }
})

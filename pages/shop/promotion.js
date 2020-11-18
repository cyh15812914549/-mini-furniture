// pages/shop/promotion.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    poster: '',
    posterHeight: 800
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let that = this

    that.setData({
      poster: app.globalData.poster
    })

    // 设置navbar标题、颜色
    app.setNavigationBar();

    wx.getImageInfo({
      src: app.globalData.poster,
      success(res) {
        that.setData({
          posterHeight: res.height
        })
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
    return {
      title: app.globalData.JXSShopName,
      path: "/pages/home/index?idt=" + app.globalData.JXSId + '&page=' + '/pages/shop/promotion' + '&JXSShopName=' + app.globalData.JXSShopName
    }
  }
})

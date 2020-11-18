// pages/home/suiteSeries.js
import {downloadFile} from "../../assets/js/common";

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    seriesLists: [

    ],
    topTxt: '',
    topImgFilePath: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()

    // 设置navbar标题、颜色
    app.setNavigationBar();
  },

  init(){
    let _this = this
    app._get('store/gallery', {}, function(result) {
      console.log(result)
      _this.setData({
        topTxt: result.data.top_txt,
        topImgFilePath: result.data.top_img_file_path,
        seriesLists: result.data.page_data
      })
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  checkDetails(e){
    let desc = e.currentTarget.dataset.item.desc
    wx.navigateTo({
      url: '/pages/home1/series-details?desc=' + desc
    })
  },

  //保存图片
  saveImg(e){
    let imgUrl = e.currentTarget.dataset.src;
    downloadFile(imgUrl)
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
      title: app.globalData.JXSShopName,
      path: "/pages/home/index?idt=" + app.globalData.JXSId + '&page=' + '/pages/home1/suiteSeries' + '&JXSShopName=' + app.globalData.JXSShopName
    }
  }
})

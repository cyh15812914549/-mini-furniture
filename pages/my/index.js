// pages/my/index.js

import {downloadFile} from "../../assets/js/common";

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: {},
    previewImageLists: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置navbar标题、颜色
    app.setNavigationBar();

    this.init()
  },

  init(){

    let that = this
    app._get('company/gallery', {}, function(result) {
      console.log(result)
      that.setData({
        imgUrls: result.data
      })
      for(let item in result.data){
        that.data.previewImageLists.push(result.data[item])
      }
    });
  },

  //  预览装卸货图片
  previewImages(e) {
    let imgUrl = e.currentTarget.dataset.src;
    wx.previewImage({
      current: imgUrl, // 当前显示图片的http链接
      urls: this.data.previewImageLists // 需要预览的图片http链接列表
    });
  },

  //保存图片
  saveImg(e){
    let imgUrl = e.currentTarget.dataset.src;
    downloadFile(imgUrl)
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
    wx.removeStorageSync('curIndex')
    wx.removeStorageSync('categoryIndex')
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
      title: '轻奢图册',
      path: "/pages/home/index?idt=" + app.globalData.JXSId + '&page=' + '/pages/my/index'
    }
  }
})

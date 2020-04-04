// pages/home/series-details.js
import {downloadFile} from "../../assets/js/common";

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailsLists: [],
    imgUrls: ['../../assets/images/banner1.jpg','../../assets/images/banner2.jpg',
      '../../assets/images/banner3.jpg','../../assets/images/banner4.jpg','../../assets/images/banner5.jpg'],
    navigationBarTitle: '',
    tags: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let arr = JSON.parse(options.item)
    console.log(arr)
    this.setData({
      detailsLists: arr,
      tags: arr.tags
    })
    wx.setNavigationBarTitle({
      title: arr.desc
    })

    // 设置navbar标题、颜色
    app.setNavigationBar();
  },

  //  预览装卸货图片
  previewImages(e) {
    let imgUrl = e.currentTarget.dataset.src;
    wx.previewImage({
      current: imgUrl, // 当前显示图片的http链接
      urls: this.data.detailsLists.imgs // 需要预览的图片http链接列表
    });
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

  }
})

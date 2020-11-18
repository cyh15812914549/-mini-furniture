// pages/home/series-details.js
import {downloadFile} from "../../assets/js/common";

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailsLists: [],
    tags: [],
    desc: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let _this = this;

    if (options.desc){
      _this.setData({
        desc: options.desc
      });
    }else {
      _this.setData({
        desc: app.globalData.desc
      });
    }


    this.init();

    wx.setNavigationBarTitle({
      title: _this.data.desc
    });

    // 设置navbar标题、颜色
    app.setNavigationBar();
  },

  init(){
    let _this = this;
    app._get('store/gallery', {}, function(result) {
      let detailsLists = result.data.page_data.filter(item => item.desc === _this.data.desc);
      _this.setData({
        detailsLists: detailsLists,
        tags: detailsLists[0].tags
      })
    });
  },

  //  预览装卸货图片
  previewImages(e) {
    let imgUrl = e.currentTarget.dataset.src;
    wx.previewImage({
      current: imgUrl, // 当前显示图片的http链接
      urls: this.data.detailsLists[0].imgs // 需要预览的图片http链接列表
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
      title: this.data.desc,
      path: "/pages/home/index?idt=" + app.globalData.JXSId + '&page=' + '/pages/home1/series-details'
          + '&desc=' + this.data.desc
    }
  }
})

// pages/goods-details/index.js
const app = getApp()

// wxParse = require("../../wxParse/wxParse.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    JXSId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,"home");
    if (options.scene){
      let scene = decodeURIComponent(options.scene);
      let sceneList = scene.split('=');
      console.log(sceneList);
      app.globalData.JXSId = sceneList[1];
      app.globalData.ifDisplayJXSData = true;
      wx.setStorageSync('JXSId', sceneList[1]);
      wx.setStorageSync('ifDisplayJXSData', true);
    } else if (options.idt){
      console.log('进入这里');
      app.globalData.JXSId = options.idt;
      app.globalData.ifDisplayJXSData = true;
      wx.setStorageSync('JXSId', options.idt);
      wx.setStorageSync('ifDisplayJXSData', true);
    } else {
      if (wx.getStorageSync('JXSId')) {
        app.globalData.JXSId = wx.getStorageSync('JXSId');
        app.globalData.ifDisplayJXSData = wx.getStorageSync('ifDisplayJXSData');
      }
    }


    wx.showLoading({
      title: '数据加载中',
      mask: true
    })

    if(options.page){
      setTimeout(() => {
        setTimeout(() => {
          wx.hideLoading()
          wx.reLaunch({
            url: options.page
          })
        }, 500)
      }, 500)
    }else {
      setTimeout( ()=> {
        setTimeout(()=>{
          wx.hideLoading()
          wx.reLaunch({
            url: '/pages/home1/index'
          })
        },500)
      }, 500)
    }

    //分享商品
    if (options.goods_id){
      app.globalData.goods_id = options.goods_id
    }

    //分享经销商图册
    if (options.desc){
      app.globalData.desc = options.desc
    }

    //记录是哪个经销商
    if (options.JXSShopName){
      app.globalData.JXSShopName = options.JXSShopName;
    }

    if (options.ifCompany){
      console.log(options.ifCompany);
      app.globalData.ifCompany = options.ifCompany;
    }

    //分享店铺
    if (options.JXSTopNav){
      app.globalData.JXSTopNav = JSON.parse(options.JXSTopNav);
    }
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
    this.getUserInfo()
  },

  /**
   * 授权登录
   */ //
  getUserInfo() {
    console.log(app.globalData.JXSId,'74')
    let App = this;
    // 执行微信登录
    wx.login({
      success(res) {
        // 发送用户信息
        app._post_form('user/login', {
          store_idt: app.globalData.JXSId
        }, result => {
          // 记录token user_id
          wx.setStorageSync('token', result.data.token);
          // 执行回调函数
          // callback && callback();
        }, false, () => {
          wx.hideLoading();
        });
      }
    });
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
  onShareAppMessage: function (res) {

  }
})

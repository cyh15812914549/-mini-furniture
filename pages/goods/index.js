import {downloadFile} from "../../assets/js/common";

let App = getApp(),
  wxParse = require("../../wxParse/wxParse.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav_select: false, // 快捷导航

    indicatorDots: true, // 是否显示面板指示点
    autoplay: true, // 是否自动切换
    interval: 3000, // 自动切换时间间隔
    duration: 800, // 滑动动画时长

    currentIndex: 1, // 轮播图指针
    floorstatus: false, // 返回顶部
    showView: true, // 显示商品规格
    paramsList: [], //参数列表

    showParam: false,//是否显示商品参数

    detail: {}, // 商品详情信息
    goods_price: 0, // 商品价格
    line_price: 0, // 划线价格
    stock_num: 0, // 库存数量

    goods_num: 1, // 商品数量
    goods_sku_id: 0, // 规格id
    cart_total_num: 0, // 购物车商品总数量
    specData: {}, // 多规格信息
    hits: 0,//浏览量
    previewImageLists: [],
    params: null,
    params1: null,
      contactWay: '',
      alreadySold: '',
    ifCompany: 0
  },

  // 记录规格的数组
  goods_spec_arr: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this;
    // 商品id
    if (options.goods_id){
      _this.data.goods_id = options.goods_id;
    } else {
      _this.data.goods_id = App.globalData.goods_id;
    }

    if (options.ifCompany){
      _this.setData({
        ifCompany: 1
      })
    }

    if (App.globalData.ifCompany === 1){
      _this.setData({
        ifCompany: 1
      })
    }

    // 获取商品信息
    _this.getGoodsDetail();

    // 设置navbar标题、颜色
    App.setNavigationBar();

    setTimeout(()=>{
      _this.data.detail.image.map(item=>{
        _this.data.previewImageLists.push(item.img_file_path)
      });
    },500)
  },

  //  预览装卸货图片
  previewImages(e) {
    let imgUrl = e.currentTarget.dataset.src;
    wx.previewImage({
      current: imgUrl, // 当前显示图片的http链接
      urls: this.data.previewImageLists // 需要预览的图片http链接列表
    });
  },

  downloadVideo(){
    let url;
    url = this.data.detail.introv.file_path.replace(/http/,'https')
    wx.downloadFile({
      url: url,
      success (res) {
        wx.saveVideoToPhotosAlbum({
          filePath: res.tempFilePath,
          success(result) {
            wx.showToast({
              title: '下载成功',
              icon: 'success',
              duration: 1500,
              mask: true
            })
          },
          fail(err) {
            console.log(err)
            wx.showToast({
              title: '下载失败,请联系管理员',
              icon: 'none'
            })
          }
        });
        if (typeof (cb) === "function" ){
          cb(res)
        }
      },
      fail(err) {
        console.log(err)
      }
    })
  },


  /**
   * 获取商品信息
   */
  getGoodsDetail() {
    let _this = this;
    App._get('goods/detail', {
      goods_id: _this.data.goods_id
    }, function(result) {
      console.log(result)
      // 初始化商品详情数据
      let data = _this.initGoodsDetailData(result.data);
      _this.setData(data);
    });
  },

  /**
   * 初始化商品详情数据
   */
  initGoodsDetailData(data) {
    let _this = this;
    for (let [key, value] of Object.entries(data.detail.params)) {
      _this.setData({
        paramsList: _this.data.paramsList.concat([key, value].join(':     '))
      })
    }

    let oneRow = 0;
    for (let [key, value] of Object.entries(data.detail.params)) {
      oneRow++;
      if (oneRow === 1){
          _this.setData({
              contactWay: [key, value].join(': ')
          });
      } else if (oneRow === 2){
          _this.setData({
              alreadySold: [key, value].join(': ')
          })
      }

    }

    // 富文本转码
    if (data.detail.content.length > 0) {
      wxParse.wxParse('content', 'html', data.detail.content, _this, 0);
    }
    // 商品价格/划线价/库存
    data.goods_sku_id = data.detail.spec[0].spec_sku_id;
    data.goods_price = data.detail.spec[0].goods_price;
    data.line_price = data.detail.spec[0].line_price;
    data.stock_num = data.detail.spec[0].stock_num;
    data.hits = data.detail.hits;
    data.params = data.detail.params;
    // 初始化商品多规格
    if (data.detail.spec_type == 20) {
      data.specData = _this.initManySpecData(data.specData);
    }
    return data;
  },

  /**
   * 初始化商品多规格
   */
  initManySpecData(data) {
    for (let i in data.spec_attr) {
      for (let j in data.spec_attr[i].spec_items) {
        if (j < 1) {
          data.spec_attr[i].spec_items[0].checked = true;
          this.goods_spec_arr[i] = data.spec_attr[i].spec_items[0].item_id;
        }
      }
    }
    return data;
  },

  /**
   * 点击切换不同规格
   */
  modelTap(e) {
    let attrIdx = e.currentTarget.dataset.attrIdx,
      itemIdx = e.currentTarget.dataset.itemIdx,
      specData = this.data.specData;
    for (let i in specData.spec_attr) {
      for (let j in specData.spec_attr[i].spec_items) {
        if (attrIdx == i) {
          specData.spec_attr[i].spec_items[j].checked = false;
          if (itemIdx == j) {
            specData.spec_attr[i].spec_items[itemIdx].checked = true;
            this.goods_spec_arr[i] = specData.spec_attr[i].spec_items[itemIdx].item_id;
          }
        }
      }
    }
    this.setData({
      specData
    });
    // 更新商品规格信息
    this.updateSpecGoods();
  },

  /**
   * 更新商品规格信息
   */
  updateSpecGoods() {
    let spec_sku_id = this.goods_spec_arr.join('_');

    // 查找skuItem
    let spec_list = this.data.specData.spec_list,
      skuItem = spec_list.find((val) => {
        return val.spec_sku_id == spec_sku_id;
      });

    // 记录goods_sku_id
    // 更新商品价格、划线价、库存
    if (typeof skuItem === 'object') {
      this.setData({
        goods_sku_id: skuItem.spec_sku_id,
        goods_price: skuItem.form.goods_price,
        line_price: skuItem.form.line_price,
        stock_num: skuItem.form.stock_num,
      });
    }
  },

  /**
   * 设置轮播图当前指针 数字
   */
  setCurrent(e) {
    this.setData({
      currentIndex: e.detail.current + 1
    });
  },

  /**
   * 控制商品规格/数量的显示隐藏
   */
  onChangeShowState() {
    this.setData({
      showView: !this.data.showView
    });
  },

  ifDisplayParam(){
    this.setData({
      showParam: !this.data.showParam
    });
  },

  /**
   * 返回顶部
   */
  goTop(t) {
    this.setData({
      scrollTop: 0
    });
  },

  /**
   * 显示/隐藏 返回顶部按钮
   */
  scroll(e) {
    this.setData({
      floorstatus: e.detail.scrollTop > 200
    })
  },

  /**
   * 增加商品数量
   */
  up() {
    this.setData({
      goods_num: ++this.data.goods_num
    })
  },

  /**
   * 减少商品数量
   */
  down() {
    if (this.data.goods_num > 1) {
      this.setData({
        goods_num: --this.data.goods_num
      });
    }
  },

  /**
   * 跳转购物车页面
   */
  flowCart: function () {
    wx.switchTab({
      url: "../flow/index"
    });
  },

  /**
   * 加入购物车and立即购买
   */
  submit(e) {
    let _this = this,
      submitType = e.currentTarget.dataset.type;

    if (submitType === 'buyNow') {
      // 立即购买
      wx.navigateTo({
        url: '../flow/checkout?' + App.urlEncode({
          order_type: 'buyNow',
          goods_id: _this.data.goods_id,
          goods_num: _this.data.goods_num,
          goods_sku_id: _this.data.goods_sku_id,
        })
      });
    } else if (submitType === 'addCart') {
      // 加入购物车
      App._post_form('cart/add', {
        goods_id: _this.data.goods_id,
        goods_num: _this.data.goods_num,
        goods_sku_id: _this.data.goods_sku_id,
      }, function(result) {
        App.showSuccess(result.msg);
        _this.setData(result.data);
      });
    }
  },


  /**
   * 分享当前页面
   */
  onShareAppMessage: function() {
    // 构建页面参数
    let _this = this,title = '';
    if (_this.data.ifCompany === 1) {
      console.log('等于1');
      title = '商品详情'
    }else {
      console.log('等于0');
      title = App.globalData.JXSShopName
    }
    return {
      title: title,
      path: "/pages/home/index?goods_id=" + _this.data.goods_id
          + "&idt=" + App.globalData.JXSId + '&page=' + '/pages/goods/index'
          + '&JXSShopName=' + App.globalData.JXSShopName + '&ifCompany=' + _this.data.ifCompany
    };
  },

  onReady: function () {
  }

})

//封装showToast提示
export const WXToast = (data) => {
  wx.showToast({
      title: data.title || '提示',
      icon : data.icon || 'none',
      duration: data.duration || 1500,
      mask: true
  })
};

//  设置scroll-view的高度; otherHeight 为需要减去的高度,单位为 rpx
export const setTheViewHeight = (otherHeight) => {
    let res = wx.getSystemInfoSync();
    let screenHeight = 750 * (res.windowHeight / res.windowWidth) - otherHeight;
    return screenHeight + 'rpx'
};

export const downloadFile = (url,cb) => {
    wx.showModal({
        title: '提示',
        content: '是否下载图片',
        cancelText: '取消',
        confirmText: '确定',
        success(res) {
            if (res.confirm) {
                const downloadTask = wx.downloadFile({
                    url: url, //仅为示例，并非真实的资源
                    success (res) {
                        wx.saveImageToPhotosAlbum({
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
            }
        }
    })
};

const util = require('../../utils/util')
const app = getApp()

Page({
  data: {
    items: [],
    newstextArr: [],
    one: '',
    state: 0, // 0 换一个, 1 制作我的祝福话
    showCustomHint: false,
    userInfo: '',
    today: util.today(),
    toname: '',
    nickName: '',
    classid: '',
    avatarUrlTempFilePath: '',
    avatarUrl: ''
  },
  onLoad: function (options) {
    wx.showLoading({})
    console.log('__preview__options__', options)
    wx.setNavigationBarTitle({
      title: '预览祝福语'
    })
    // this.setData({
    //   nickName: wx.getStorageSync('storageUserInfo').nickName,
    //   avatarUrl: wx.getStorageSync('storageUserInfo').avatarUrl
    // })
    // console.log('__nickname__',this.data.nickName)
    // console.log('__avatarUrl__', this.data.avatarUrl)
    if (options.state == 1) {
      console.log('111111')
      this.setData({
        one: options.from_sentence,
        toname: options.from_toname,
        state: 1,
        avatarUrl: wx.getStorageSync('storageUserInfo').avatarUrl,
        nickName: wx.getStorageSync('storageUserInfo').nickName
      })
      wx.hideLoading()
      return false
    }
    else if (options.state == 2) {
      console.log('__options.state = 2__', options.state)
      this.setData({
        one: options.from_sentence,
        toname: options.from_toname,
        state: 2,
        avatarUrl: wx.getStorageSync('storageUserInfo').avatarUrl,
        // avatarUrl: options.from_avatarUrl,
        nickName: wx.getStorageSync('storageUserInfo').nickName
      })
      wx.hideLoading()
    }else {
      console.log('2222')
      wx.setStorageSync('storageToname', options.toname)
      this.setData({
        toname: options.toname,
        classid: options.classid,
        avatarUrl: wx.getStorageSync('storageUserInfo').avatarUrl,
        nickName: wx.getStorageSync('storageUserInfo').nickName
      })
      console.log('-nickNames--', this.data.nickName)

      let that = this
      wx.request({
        url: 'https://www.yishuzi.com.cn/jianjie8_xiaochengxu_api/xiaochengxu/wish/?getJson=texts&classid=' + options.classid,
        success(json) {
          console.log('__json__', json.data.result)
          let __jsons = json.data.result
          let _one = __jsons[Math.floor(Math.random() * __jsons.length)]
          that.setData({
            newstextArr: __jsons,
            one: _one.txt
          })
          wx.hideLoading()
        }
      })
    }
  },
  bindViewTap() {
    console.log('__bindViewTap__')
    console.log('__this.data.state__', this.data.state)
    if (this.data.state === 0 || this.data.state === 2) {
      console.log('__bindViewTap__1111')
      wx.navigateTo({
        url: '/pages/custom/custom?&from_sentence=' + this.data.one + '&from_toname=' + this.data.toname + '&from_avatarUrl=' + this.data.avatarUrl + '&from_nickName=' + this.data.nickName
      })
    }
  },
  goHome: function () {
    wx.switchTab({
      url: '/pages/index/index?tonames='
    })
  },
  reply: function () {
    wx.switchTab({
      url: '/pages/index/index?tonames=' + this.data.nickName
    })
  },
  changeOne: function () {
    let __jsons = this.data.newstextArr
    let _one = __jsons[Math.floor(Math.random() * __jsons.length)]
    this.setData({
      one: _one.txt
    })
  },
  onShow: function () {
    // 判断是否需要展示 点击跳转至自定义页面的提示
    let preview_custom_hint = wx.getStorageSync('preview-custom-hint') || false
    this.setData({
      showCustomHint: preview_custom_hint
    })
  },
  confirmCustomHint: function () {
    wx.setStorageSync('preview-custom-hint', true)
    this.setData({
      showCustomHint: true
    })
  },
  onShareAppMessage() {
    let name = (this.data.nickName == undefined) ? '' : '【' + this.data.nickName + '】'
    return {
      title: '您好友' + name + '发来神秘消息,点击查看详情...',
      imageUrl: '../../images/shenmi_share.png',
      desc: '你也可以制作祝福话送给TA哟！',
      path: '/pages/preview/preview?&state=1&from_sentence=' + this.data.one + '&from_toname=' + this.data.toname + '&from_avatarUrl=' + this.data.avatarUrl + '&from_nickName=' + this.data.nickName
    }
  },
  drawText: function (ctx, str, initHeight, titleHeight, canvasWidth) {
    var lineWidth = 0
    var lastSubStrIndex = 0; // 每次开始截取的字符串的索引
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width
      if (lineWidth > canvasWidth) {
        ctx.fillText(str.substring(lastSubStrIndex, i), 80, initHeight); // 绘制截取部分
        initHeight += 30; // 20为字体的高度
        lineWidth = 0
        lastSubStrIndex = i
      // titleHeight += 30
      }
      if (i == str.length - 1) { // 绘制剩余部分
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), 80, initHeight)
      }
    }
    console.log('----initHeight--', initHeight)
    // 标题border-bottom 线距顶部距离
    titleHeight = titleHeight + 100
    return titleHeight
  },
  // 创建海报
  creat: function () {
    wx.showLoading({
      title: '生成中'
    })
    console.log('https://www.yishuzi.com.cn/e/api/jianjie8_xiaochengxu/wish_xiaochengxu_qrode.php?path=' + encodeURIComponent('pages/jieri_detail/jieri_detail') + '&scene=start_index&width=100')
    let that = this
    wx.getImageInfo({
      src: this.data.avatarUrl,
      success: function (_res) {
        that.setData({
          avatarUrlTempFilePath: _res.path
        })
      }
    })
    wx.getImageInfo({
      src: 'https://www.yishuzi.com.cn/e/api/jianjie8_xiaochengxu/wish_xiaochengxu_qrode.php?path=' + encodeURIComponent('pages/jieri_detail/jieri_detail') + '&scene=start_index&width=100',
      success: function (res) {
        console.log('that.data', res)
        that.setData({
          tempFilePath: res.path
        })
        // 开始绘画
        const ctx = wx.createCanvasContext('shareCanvas')
        let _width = 250
        ctx.fillRect(0, 0, _width, 600)
        ctx.setFontSize(20)
        ctx.fillStyle = '#333'
        ctx.lineWidth = 0
        ctx.drawImage('../../images/duanzi_bg.png', 0, 0, 400, 600)
        var str = that.data.one.replace(/<[^<>]+>/g, '').substring(0, 100) + '...'
        var titleHeight = 50; // 标题的高度
        var canvasWidth = _width; // 计算canvas的宽度
        var initHeight = 150; // 绘制字体距离canvas顶部初始的高度
        // 标题border-bottom 线距顶部距离
        titleHeight = that.drawText(ctx, str, initHeight, titleHeight, canvasWidth); // 调用行文本换行函数
        console.log('titleHeight---', str.height)
        ctx.moveTo(200, titleHeight)

        ctx.stroke() // 绘制已定义的路径

        ctx.setFontSize(20)
        ctx.fillStyle = '#666'
        ctx.fillText('祝 ' + that.data.toname + ':', 50, 110)

        ctx.setFontSize(14)
        ctx.fillStyle = '#666'
        ctx.fillText('识别二维码微信搜索“爱祝福语”,大量祝福语供您选择', 40, 480)

        ctx.drawImage(that.data.tempFilePath, 155, 495, 80, 80)

        ctx.setFontSize(16)
        ctx.fillStyle = '#666'
        // ctx.setTextAlign('right')
        ctx.fillText('您的朋友:' + that.data.nickName, 150, 410)

        ctx.setFontSize(16)
        ctx.fillStyle = '#666'
        // ctx.setTextAlign('right')
        ctx.fillText(that.data.today, 150, 440)


        ctx.draw(true, setTimeout(function () {
          wx.canvasToTempFilePath({
            canvasId: 'shareCanvas',
            success: (res) => {
              that.setData({
                shareTempFilePath: res.tempFilePath
              })
              wx.hideLoading()
              // 预览图片
              that.previewImages(res.tempFilePath)
            // that.saveImageToPhotosAlbum()
            }
          })
        }, 100))
      }
    })
  },
  previewImages: function (e) {
    console.log('eee', e)
    var current = e
    wx.previewImage({
      current: current,
      urls: ['' + current + '']
    })
  },
  // 保存至相册
  saveImageToPhotosAlbum: function () {
    wx.showModal({
      title: '提示',
      content: '需要立即保存到相册吗？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if (result.confirm) {
          wx.saveImageToPhotosAlbum({
            filePath: this.data.shareTempFilePath,
            success: (res) => {
              if (res.errMsg == 'saveImageToPhotosAlbum:ok') {
                wx.showModal({
                  content: '保存成功',
                  showCancel: false
                })
              }
            },
            fail: (err) => {
              console.log(err)
            }
          })
        }
      },
      fail: () => {
      },
      complete: () => {
      }
    })
  }
})

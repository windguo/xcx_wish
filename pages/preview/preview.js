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
    avatarUrl: ''
  },
  onLoad: function (options) {
    wx.showLoading({});
    console.log('__options__', options);
    wx.setNavigationBarTitle({
      title: '预览祝福语'
    });
    if (options.state == 1) {
      console.log('111111')
      this.setData({
        one: options.from_sentence,
        toname: options.from_toname,
        state: 1,
        avatarUrl: options.from_avatarUrl,
        nickName: options.from_nickName
      });
      wx.hideLoading();
      return false;
    }
    else if(options.state == 2){
      console.log('__state__',options.state);
      this.setData({
        one: options.from_sentence,
        toname: options.from_toname,
        state:2,
        avatarUrl: wx.getStorageSync('storageUserInfo').avatarUrl,
        avatarUrl: options.from_avatarUrl,
        nickName: options.from_nickName
      });
      wx.hideLoading();
    }else {
      console.log('2222');
      wx.setStorageSync('storageToname', options.toname);
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
          });
          wx.hideLoading();
        }
      })
    }
  },
  bindViewTap() {
    console.log('__bindViewTap__');
    console.log('__this.data.state__', this.data.state);
    if (this.data.state === 0 || this.data.state === 2) {
      console.log('__bindViewTap__1111');
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
    console.log('/pages/preview/preview?&state=1&from_sentence=' + this.data.one + '&from_toname=' + this.data.toname + '&from_avatarUrl=' + this.data.avatarUrl + '&from_nickName=' + this.data.nickName)
    return {
      title: '您的微信好友【' + this.data.nickName + '】给您发来祝福',
      desc: '你也可以制作祝福话送给TA哟！',
      path: '/pages/preview/preview?&state=1&from_sentence=' + this.data.one + '&from_toname=' + this.data.toname + '&from_avatarUrl=' + this.data.avatarUrl + '&from_nickName=' + this.data.nickName
    }
  }
})

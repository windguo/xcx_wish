const app = getApp();

Page({
  data:{
    toname:'',
    nickName:'',
    wishes:'',
    avatarUrl:''
  },
  onLoad:function(options){
    wx.setNavigationBarTitle({
      title: '编辑祝福语'
    });
    console.log('_custon_options__', options);
    this.setData({
      toname: options.from_toname,
      nickName: wx.getStorageSync('storageUserInfo').nickName,
      wishes: options.from_sentence,
      avatarUrl: wx.getStorageSync('storageUserInfo').avatarUrl
    });
  },
  save:function(e){
    console.log('__save__start__e_', e);
    if(e.detail.value.toname == ''){
      wx.showModal({
        content: '请输入祝福接收人的姓名',
        showCancel: false
      });
      return false;
    };
    wx.setStorageSync('storage_wishes', e.detail.value.bestWishes);
    wx.navigateTo({
      url: '/pages/preview/preview?state=2&from_toname=' + e.detail.value.toname + '&from_sentence=' + e.detail.value.bestWishes + '&from_nickName=' + e.detail.value.nickName + '&from_avatarUrl=' + this.data.avatarUrl
    })
  },
  "more-template": function () {
    wx.redirectTo({
      url: '/pages/jieri_list/jieri_list'
    })
  }, 
  "more-template-richang": function () {
    wx.redirectTo({
      url: '/pages/richang_list/richang_list'
    })
  },
})
const app = getApp();

Page({
  data:{
    toname:'',
    nickName:'',
    wishes:'',
    avatarUrl:''
  },
  onLoad:function(options){
    console.log('__options__', options);
    this.setData({
      toname: options.from_toname,
      nickName: options.from_nickName,
      wishes: options.from_sentence,
      avatarUrl: options.from_avatarUrl
    })
  },
  save:function(e){
    console.log('__save__start___', e.detail.value.bestWishes);
    wx.setStorageSync('storage_wishes', e.detail.value.bestWishes);
    wx.navigateTo({
      url: '/pages/preview/preview?state=2&from_toname=' + e.detail.value.toname + '&from_sentence=' + e.detail.value.bestWishes + '&from_nickName=' + e.detail.value.nickName + '&from_avatarUrl=' + this.data.avatarUrl
    })
  }
})
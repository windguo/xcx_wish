const app = getApp()

Page({
	data: {
		items: [],
		userInfo: {},
		toname: '',
		nickName: wx.getStorageSync('storageUserInfo').nickName,
		userinfos: wx.getStorageSync('storageUserInfo').nickName ? true : false,
		radios: 254,
		hidden: true
	},
	gifHidden: function () {
		this.setData({
			hidden: true
		})
	},
	onLoad: function (options) {
		wx.showLoading({})
		if (this.data.userinfos){
			wx.switchTab({
				url: '../index/index'
			});
		}
		wx.setNavigationBarTitle({
			title: '生日祝福语'
		})
		console.log('---index---options---', options)
		if (options.tonames && options.tonames !== '') {
			this.setData({
				toname: options.tonames
			})
		}
		this.getClassFn()
	},
	getClassFn: function () {
		console.log('getClassFn')
		let that = this
		wx.request({
			url: 'https://www.yishuzi.com.cn/jianjie8_xiaochengxu_api/xiaochengxu/wish/?getJson=class&classid=253&publish=1',
			header: {
				'content-type': 'application/json' // 默认值
			},
			success(res) {
				that.setData({
					items: res.data.result
				})
				wx.hideLoading()
			}
		})
	},
	onGotUserInfo: function (e) {
		wx.setStorageSync('storageUserInfo', e.detail.userInfo)
		this.setData({
			userinfos: true,
			nickName: wx.getStorageSync('storageUserInfo').nickName
		});
		wx.switchTab({
			url: '../index/index'
		});
	},
	radioChange: function (e) {
		console.log('radio发生change事件，携带value值为：', e.detail.value)
		this.setData({
			radios: e.detail.value
		})
	},
	generate: function (e) {
		let _nickName = wx.getStorageSync('storageUserInfo').nickName
		if (!_nickName) {
			console.log('1111')
			wx.showModal({
				content: '请先点击上方【微信授权】按钮,并点击允许获取微信名和头像',
				showCancel: false
			})
			return false
		}
		let data = e.detail.value
		console.log('_data_', data)
		if (data.toname == '') {
			wx.showModal({
				content: '请输入生日祝福接收人的姓名',
				showCancel: false
			})
			return false
		}
		wx.navigateTo({
			url: '/pages/preview/preview?classid=' + data.classid + '&toname=' + data.toname
		})
	},
	onShareAppMessage: function (res) {
		return {
			title: '最新最全的节日生日祝福语大全',
			imageUrl: '../../indexPic.png',
			success: (res) => {
				wx.showToast({
					content: '分享成功'
				})
			},
			fail: (res) => {
				wx.showToast({
					content: '分享失败,原因是' + res
				})
			}
		}
	}
})

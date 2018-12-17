var app = getApp();
Page({
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log('res.target===', res.target);
            return {
                title: this.data.title,
                imageUrl: this.data.titlepic,
                success: (res) => {
                    wx.showToast({
                        content: '分享成功'
                    });
                },
                fail: (res) => {
                    wx.showToast({
                        content: '分享失败,原因是' + res
                    });
                }
            }
        } else {
            return {
                title: '各类爆笑笑话段子每日更新...',
                path: '/pages/duanzi/duanzi',
                success: (res) => {
                    wx.showToast({
                        content: '分享成功'
                    });
                },
                fail: (res) => {
                    wx.showToast({
                        content: '分享失败,原因是' + res
                    });
                }
            }
        }
    },
    data: {
        index: null,
        winHeight: "", //窗口高度
        currentTab: 0, //预设当前项的值
        scrollLeft: 0, //tab标题的滚动条位置
        expertListi: [],
        expertList: [],
        username: '',
        nickName: '',
        toname: '',
        classid: '',
        avatarUrl: '',
        expertListId: [],
        _windowWidth: wx.getSystemInfoSync().windowWidth,
        contentArray: []
    },
    getListData: function (classid, more) {
        console.log('getListData---===--start');
        let that = this;
        let _arr = this.data.contentArray;
        // console.log('__classid__', classid);
        console.log('https://www.yishuzi.com.cn/jianjie8_xiaochengxu_api/xiaochengxu/wish/?getJson=richang&classid=' + classid);
        wx.request({
            url: 'https://www.yishuzi.com.cn/jianjie8_xiaochengxu_api/xiaochengxu/wish/?getJson=richang&classid=' + classid,
            method: 'GET',
            dataType: 'json',
            success: (json) => {
                console.log('json.data.result---', json);
                if (more) {
                    let __jsons = json.data.result;
                    console.log('____jsons__', __jsons);
                    that.setData({
                        contentArray: __jsons
                    });
                } else {
                    let __jsons = json.data.result;
                    console.log('____jsons__', __jsons);
                    that.setData({
                        contentArray: __jsons
                    });
                };
                console.log('contentArray--==', this.data.contentArray);
                wx.hideLoading();
            }
        })
    },
    // 滚动切换标签样式
    swiperChange: function (e) {
        console.log('swiperChange==e', e);
        this.setData({
            currentTab: e.detail.current
        });
        this.getListData(this.data.expertListId[e.detail.current]);
        this.checkCor();
    },
    // 点击标题切换当前页时改变样式
    swichNav: function (e) {
        console.log('eee--click', e);
        var cur = e.target.dataset.current;
        if (this.data.currentTaB == cur) {
            return false;
        } else {
            this.setData({
                currentTab: cur
            })
        };
        this.getListData(this.data.expertListId[cur]);
    },
    //判断当前滚动超过一屏时，设置tab标题滚动条。
    checkCor: function () {
        wx.showLoading({}),
            this.setData({
                scrollLeft: 100 * this.data.currentTab - 200
            });
    },
    onLoad: function (options) {
        wx.showLoading({});
        this.setData({
            toname: wx.getStorageSync('storageToname'),
            nickName: wx.getStorageSync('storageUserInfo').nickName,
            avatarUrl: wx.getStorageSync('storageUserInfo').avatarUrl
        });
        console.log('__storageToname__', wx.getStorageSync('storageToname'));
        wx.setNavigationBarTitle({
            title: '节日祝福语'
        });
        let _classid = [];
        let _expertListi = [];
        wx.request({
            url: 'https://www.yishuzi.com.cn/jianjie8_xiaochengxu_api/xiaochengxu/wish/?getJson=class&classid=261',
            method: 'GET',
            dataType: 'json',
            success: (json) => {
                console.log('json000class===--', json.data.result);
                for (var i = 0; i < json.data.result.length; i++) {
                    _expertListi.push(i)
                    _classid.push(json.data.result[i].classid);
                };
                this.setData({
                    expertList: json.data.result,
                    expertListi: _expertListi,
                    expertListId: _classid
                });
            }
        });
        this.getListData(this.data.currentTab);
        var that = this;
        //  高度自适应
        wx.getSystemInfo({
            success: function (res) {
                var clientHeight = res.windowHeight,
                    clientWidth = res.windowWidth,
                    rpxR = 750 / clientWidth;
                var calc = clientHeight * rpxR - 98;
                that.setData({
                    winHeight: calc
                });
            }
        });
    },
    scrolltolowerLoadData: function (e) {
        console.log('scrolltolowerLoadData', e);
        this.getListData(this.data.expertListId[this.data.currentTab], true);
    }
})
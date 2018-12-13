var WxParse = require('../../wxParse/wxParse.js')

var app = getApp();
Page({
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log('res.target===', res.target);
            return {
                title: this.data.title,
                path: '/pages/duanzi_detail/duanzi_detail?id=' + this.data.id,
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
                title: this.data.title,
                path: '/pages/duanzi_detail/duanzi_detail?id=' + this.data.id,
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
        winHeight: "",//窗口高度
        currentTab: 0, //预设当前项的值
        scrollLeft: 0, //tab标题的滚动条位置
        expertListi: [],
        expertList: [],
        expertListId: [],
        _windowWidth: wx.getSystemInfoSync().windowWidth,
        contentArray: [],
        title:'',
        smalltext:'',
        avatarUrl:'',
        id:'',
        qrodeImg:'',
        width:'',
        classid:'',
        height:'',
        height:'',
        shareTempFilePath:'',
        tempFilePath:'',
        _id:'',
        newstext:''
    },
    onLoad: function (options) {
        wx.showLoading({})
        console.log('---==--options--', options);
        wx.setNavigationBarTitle({
            title: '祝福语详情页'
        });
        WxParse.wxParse('article', 'html', options.from_sentence, this, 5);
        this.setData({
            smalltext: options.from_sentence,
            toname: options.from_toname,
            nickName: options.from_nickName,
            avatarUrl: options.from_avatarUrl
        })
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
        console.log('this.data.classid--', this.data.classid);
        this.getListData(this.data.classid);
    },
    copyTBL: function (e) {
        console.log('wwweeee', e);
        var self = this;
        wx.setClipboardData({
            data: e.currentTarget.dataset.text.trim(),
            success: function (res) {
                wx.getClipboardData({
                    success: function (res) {
                        wx.showToast({
                            title: '复制成功',
                        })
                    }
                })
            }
        })
    },
    getListData: function (classid, more) {
        console.log('getListData---===--start');
        let that = this;
        let _arr = this.data.contentArray;
        wx.request({
            url: 'https://www.yishuzi.com.cn/jianjie8_xiaochengxu_api/xiaochengxu/wish/?getJson=texts&classid=' + classid,
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
    returnHome:function(){
        wx.switchTab({
            url:'/pages/index/index'
        })
    },
    drawText: function (ctx, str, initHeight, titleHeight, canvasWidth) {
        var lineWidth = 0;
        var lastSubStrIndex = 0; //每次开始截取的字符串的索引
        for (let i = 0; i < str.length; i++) {
            lineWidth += ctx.measureText(str[i]).width;
            if (lineWidth > canvasWidth) {
                ctx.fillText(str.substring(lastSubStrIndex, i), 40, initHeight);//绘制截取部分
                initHeight += 30;//20为字体的高度
                lineWidth = 0;
                lastSubStrIndex = i;
                // titleHeight += 30;
            }
            if (i == str.length - 1) {//绘制剩余部分
                ctx.fillText(str.substring(lastSubStrIndex, i + 1), 40, initHeight);
            }
        }
        console.log('----initHeight--', initHeight);
        // 标题border-bottom 线距顶部距离
        titleHeight = titleHeight + 100;
        return titleHeight
    },
    //创建海报
    // creat: function () {
    //     console.log('https://www.yishuzi.com.cn/e/api/jianjie8_xiaochengxu/wish_xiaochengxu_qrode.php?path=' + encodeURIComponent("pages/jieri_detail/jieri_detail") + '&scene=' + this.data.smalltext + '&width=100');
    //     let that = this;
    //     wx.getImageInfo({
    //         src: 'https://www.yishuzi.com.cn/e/api/jianjie8_xiaochengxu/wish_xiaochengxu_qrode.php?path=' + encodeURIComponent("pages/jieri_detail/jieri_detail") + '&scene=' + this.data.smalltext + '&width=100',
    //         success: function (res) {
    //             console.log('that.data', res);
    //             that.setData({
    //                 tempFilePath:res.path
    //             });
    //             // 开始绘画
    //             const ctx = wx.createCanvasContext('shareCanvas');
    //             let _width = 650;
    //             ctx.fillRect(0, 0, _width, 800);
    //             ctx.setFontSize(20);
    //             ctx.fillStyle = "#555";
    //             ctx.lineWidth = 0;
    //             ctx.drawImage('../../images/wish_bg.png', 0, 0, 400, 800);
    //             var str = that.data.smalltext.replace(/<[^<>]+>/g, '').substring(0, 180) + '...';
    //             var titleHeight = 50; // 标题的高度
    //             var canvasWidth = _width - 340;//计算canvas的宽度
    //             var initHeight = 180;//绘制字体距离canvas顶部初始的高度
    //             // 标题border-bottom 线距顶部距离
    //             titleHeight = that.drawText(ctx, str, initHeight, titleHeight, canvasWidth);// 调用行文本换行函数
    //             console.log('titleHeight---', str.height);
    //             ctx.moveTo(130, titleHeight);
                
    //             ctx.stroke() //绘制已定义的路径
    //             ctx.setFontSize(16);
    //             ctx.fillStyle = "#ed5935";
    //             ctx.fillText('识别小程序码,开启更多节日祝福', 90, 550)
                
    //             ctx.drawImage(that.data.tempFilePath, 140, 585, 120, 120);

    //             ctx.draw(true, setTimeout(function () {
    //                 wx.canvasToTempFilePath({
    //                     canvasId: 'shareCanvas',
                        
    //                     success: (res) => {
    //                         that.setData({
    //                             shareTempFilePath: res.tempFilePath
    //                         });
    //                         // 预览图片
    //                         that.previewImage(that.data.shareTempFilePath);
    //                     }
    //                 })
    //             }, 100))
    //         }
    //     })
    // },
    scrolltolowerLoadData: function (e) {
        console.log('scrolltolowerLoadData', e);
        this.getListData(this.data.classid, true);
    },
    previewImage: function (e) {
        console.log('eee', e);
        var current = e;
        wx.previewImage({
            current: current,
            urls: ['' + current + '']
        })
    },
    //保存至相册
    saveImageToPhotosAlbum: function () {
        if (!this.data.shareTempFilePath) {
            wx.showModal({
                title: '提示',
                content: '请先点击生成海报',
                showCancel: false
            })
        }
        wx.saveImageToPhotosAlbum({
            filePath: this.data.shareTempFilePath,
            success: (res) => {
                if (res.errMsg == "saveImageToPhotosAlbum:ok") {
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
})
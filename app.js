//app.js
App({
  onLaunch: function () {
    wx.login({
      success: function (res) {
        var that = this
        // 如果获取到登录态
        if (res.code) {
          //获取缓存中的token
          var token = wx.getStorageSync("token")
          //判断token是否存在，不存在则执行登录
          if (!token) {
            wx.request({
              url: 'https://api.lefer.cn/note/onLogin',
              method: "GET",
              data: {
                code: res.code
              },
              success: function (res) {
                if (res.data.status == "401") {
                  wx.setStorageSync("key", res.data.data)
                  wx.setStorageSync("token", "no")
                  console.log("用户未登陆!")
                }
                if (res.data.status == "200") {
                  wx.setStorageSync("key", "no")
                  wx.setStorageSync("token", res.data.data)
                  console.log("用户登陆成功!")
                }
              }
            })
          }
        } else {
          console.log("获取用户登录态失败", res.errMsg);
        }
      }
    });
  },

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function (res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  globalData: {
    userInfo: null,
    token: null,
    openid: null
  }
})

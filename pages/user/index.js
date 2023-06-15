const {
  getFavoritesByUsername
} = require("../../utils/api")

Page({
  data: {
    // 初始化用户信息对象
    userInfo: {
      nickname: '', // 用户昵称
      avatar: '' // 用户头像URL
    },
    showLoginButton: true, // 控制登录按钮的显示状态
    favoriteList: {} // 收藏列表
  },
  doGetUserData() {
    // 调用微信的获取用户信息API
    wx.getUserProfile({
      desc: '申请获取你的个人资料',
      success: (async ({
        userInfo
      }) => { // 接口调用成功的回调函数
        this.updateFavoritesList(),
        this.setData({
          userInfo: {
            nickname: userInfo.nickName,
            avatar: userInfo.avatarUrl,
          },
          showLoginButton: false, // 设置登录按钮不可见
        });
      }),
      fail: () => wx.showToast({
        title: '获取失败',
        icon: 'error'
      }) // 接口调用失败的回调函数
    })
  },
  async updateFavoritesList () {
    const favoriteList = await getFavoritesByUsername()
    this.setData({ favoriteList })
  }


})
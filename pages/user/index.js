Page({
  // 初始化页面数据
  data:{
      // 初始化用户信息对象
      userInfo: {
          nickname: '', // 用户昵称
          avatar: ''    // 用户头像URL
      }
  },
  // 获取用户数据的方法
  doGetUserData () {
      // 调用微信的获取用户信息API
      wx.getUserProfile({
          desc: '申请获取你的个人资料',  
          success: ({ userInfo }) => {  // 接口调用成功的回调函数
              // 更新页面数据中的用户信息，昵称和头像URL
              this.setData({
                  userInfo: { 
                      nickname: userInfo.nickName, 
                      avatar: userInfo.avatarUrl 
                  }
              })
          },
          fail: () => wx.showToast({ 
              title: '获取失败', 
              icon: 'error' 
          })  // 接口调用失败的回调函数
      })
  }
})

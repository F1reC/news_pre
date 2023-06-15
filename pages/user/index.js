Page({
  // 初始化页面数据
  data:{
      // 初始化用户信息对象
      userInfo: {
          nickname: '', // 用户昵称
          avatar: ''    // 用户头像URL
      },
      showLoginButton: true, // 控制登录按钮的显示状态
      favorites:[] // 收藏列表
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
                  },
                  showLoginButton: false // 设置登录按钮不可见
              })

              // 获取收藏列表
              wx.request({
                url: 'https://example.com/api/getFavorites', // 服务器接口地址
                data: {
                    userId: userInfo.userId // 传递用户ID
                },
                success: (res) => {
                    if (res.data.success) {
                        // 把获取到的收藏列表数据保存到favorites数组中
                        this.setData({
                            favorites: res.data.favorites
                        });
                    } else {
                        wx.showToast({
                            title: '获取收藏列表失败',
                            icon: 'error'
                        });
                    }
                }
            });
          },
          fail: () => wx.showToast({ 
              title: '获取失败', 
              icon: 'error' 
          })  // 接口调用失败的回调函数
      })
  }
})

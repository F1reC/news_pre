const { getSubscribeChannels } = require("../../utils/api")

Page({
  data:{
    channels:[]
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.updateSubscribeChannels()
  },
// 获取并设置当前频道的详细信息的异步方法
  async updateSubscribeChannels () {
    const channels = await getSubscribeChannels()
    this.setData({ channels })
  }
})
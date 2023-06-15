// 引入两个模块，getSubscribeChannels获取用户订阅的频道，getNewsByCategory获取某个类别的新闻
const { getSubscribeChannels, getNewsByCategory } = require("../../utils/api")

Page({
    data: {
        channelId: 0, // 频道ID，默认为0
        channel: {}, // 频道信息，默认为空对象
        articles: [] // 文章列表，默认为空数组
    },
    onShow(){  // 页面显示/切入前台时触发
        
    },
    onLoad: function({ channel }) { // 页面加载时运行，接受传入的channel参数
        this.setData({ channelId: channel }) // 设置当前页面的channelId数据为传入的channel
        this.getChannelInfo() // 获取并设置当前频道的详细信息
        this.getNewsInfo() // 获取并设置当前频道的新闻信息
    },

    // 获取并设置当前频道的详细信息的异步方法
    async getChannelInfo () {
        const { channelId } = this.data // 获取当前频道ID
        const channels = await getSubscribeChannels() // 获取所有频道
        const channel = channels.find(c => c.id == channelId) // 在所有订阅频道中找到当前频道
        this.setData({ channel }) // 更新当前频道信息
        wx.setNavigationBarTitle({ title: channel.name, }) // 将小程序的导航栏标题设置为当前频道的名字
    },

    // 获取并设置当前频道的新闻信息的异步方法
    async getNewsInfo () {
        const articles = await getNewsByCategory(this.data.channelId, 1) // 获取当前频道的新闻，传入参数为频道ID和页码（这里是第一页）
        this.setData({ articles }) // 更新文章列表
    }
})

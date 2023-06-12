/**
用户自定义需要显示的分类 */
const { getCategroyList, saveSubscribeList } = require("../../utils/api")
// 存储分类列表数据
Page({ data:{ categoryList: []  },

// 页面加载时获取分类列表数据
onLoad (){
    getCategroyList().then(categoryList => this.setData({ categoryList }))
},

// 添加关注
addSubscribe (event) {
    this.subscribeAction('add', event.target.dataset.id)
},

// 取消关注
delSubscribe (event) {
    // 获取已经选中的分类数量
    const count = this.data.categoryList.filter(c => c.selected).length
    // 如果只剩下一个分类，不允许取消关注
    if (count <= 1) {
        return wx.showToast({ title: '请至少保留一个频道', icon: 'error' })
    }
    this.subscribeAction('del', event.target.dataset.id)
},

// 关注全部分类
subscribeAll () {
    this.subscribeAction('all')
},

// 执行关注或取消关注操作
subscribeAction (command, id) {
    const categoryList = this.data.categoryList.slice(0)
    if (command === 'all') {
        // 全部关注
        categoryList.forEach(item => item.selected = true)
    } else if (command === 'add') {
        // 添加关注
        categoryList.find(item => item.id === id).selected = true
    } else if (command === 'del') {
        // 取消关注
        categoryList.find(item => item.id === id).selected = false
    } else {
        throw new Error('未知操作：' + command)
    }
    // 更新分类列表数据
    this.setData({ categoryList })
    // 获取已经关注的分类列表
    const subscribeList = categoryList.filter(c => c.selected).map(c => c.id)
    // 保存已经关注的分类列表
    saveSubscribeList(subscribeList)
},

// 返回首页
onBackHome(){
    wx.navigateBack()
},
}
)
// manage.json页面标题
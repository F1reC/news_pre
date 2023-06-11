// 引入API工具函数
const { getArticleDetail, getNewsByCategory } = require("../../utils/api")

// 页面对象
Page({
    // 页面数据
    data:{
        article:{},
        tagStyle: {
            img: "display: block; width: 100%; height: auto;",
            h2: "margin: 10px 0",
        },
        relations: []
    },
    // 页面加载时执行
    onLoad:function({ id }){
        // 刷新文章详情
        this.refreshArticle(id)
        // 刷新相关文章
        this.refreshRelationArticles()
    },
    // 获取文章详情
    async refreshArticle (id) {
        const article = await getArticleDetail(id)
        this.setData( { article } )
    },
    // 获取相关文章
    async refreshRelationArticles () {
        const relations = await getNewsByCategory(0)
        this.setData({ relations })
    }
})
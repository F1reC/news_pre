// index.js

// 导入API方法 
const { getCategroyList, getHomeBannerList, getNewsByCategory } = require("../../utils/api")

// 定义页面对象 
Page({ // 页面的初始数据 
  data: { bannerList: [], categoryTabs: [], currentTab: 0, newsCache: {}, news: {} },

// 生命周期函数--监听页面加载
onLoad () {
  this.doLoadHomeBanners()
},

// 生命周期函数--监听页面显示
onShow (){
  this.doLoadCategorys()
},

// 加载分类数据
async doLoadCategorys () {
  const categorys = await getCategroyList()
  const categoryTabs = categorys.filter(c => c.selected)
  this.setData({ categoryTabs, currentTab: categoryTabs[0].id })
  this.doLoadNews()
},

// 加载首页轮播图数据
async doLoadHomeBanners () {
  const bannerList = await getHomeBannerList()
  this.setData({ bannerList })
},

// 加载新闻数据
async doLoadNews () {
  const { currentTab, newsCache } = this.data
  if (!newsCache[currentTab]) {
      newsCache[currentTab] = { categoryId: currentTab, page: 1, isLoading: false, newsList: [] }
  }
  const news = newsCache[currentTab]
  if (news.isLoading) {
      return
  }
  news.isLoading = true
  this.setData({ news })
  try {
      const newslist = await getNewsByCategory(news.categoryId, news.page)
      if (newslist.length) {
          news.page += 1
          news.newsList.push(...newslist)
      }
      news.isLoading = false
  } catch (err) {
      news.isLoading = false
  }
  this.setData({ news })
},

// 页面相关事件处理函数--监听用户下拉动作，下拉刷新
onPullDownRefresh(){
  this.newsCache = {}
  this.doLoadNews()
},

// 页面上拉触底事件的处理函数，加载更多新闻
onReachBottom(){
  this.doLoadNews()
},

// 切换当前选择的分类
changeCategory (event){
  const { newsCache } = this.data
  var tabId = event.target.dataset.id
  if (newsCache[tabId]) {
      this.setData({ news: newsCache[tabId], currentTab: tabId })
  } else {
      this.doLoadNews()
      this.setData({ currentTab: tabId })
  }
},

// 获取新闻列表
getNewsList(chid = 0,page = 0){
  
  if(!cache[chid]){
      // 新内容
      cache[chid] = {slides:[],news:[],page:0,time:Date.now()}
  }
  var infos = cache[chid]
  // 获取下一页数据
  if(page){
      // 加载中。无法触发
      if(this._isLoading){
          return false;
      }
      infos.page += 1
  }else{
      // 直接从缓存中取出
      if(infos.news.length){
          this.setData({
              bannerList:infos.slides,
              articles:infos.news
          })
          return false
      }
  }

  // 设置加载状态
  this._isLoading = true
  
  // 请求新闻数据
  $vm.utils.post('v2/news/list.html',{chid:chid,page:infos.page}).then(res => {
      this._isLoading = false

      var {code,newsList,newsBanner} = res
      if(code === 0){
          // 新闻管理
          if(newsList && newsList.length){
              var datas = parseNews(newsList)
              infos.news.push(...datas)
          }
          // 轮播管理
          if(newsBanner && newsBanner.length){
              var banners = newsBanner.map(news => {
                  return {
                      id:news.news_id,
                      title:news.news_title,
                      image:news.news_icon.pop(),
                      style:news.news_style
                  }
              })
              infos.slides.push(...banners)
          }
          this.setData({
              bannerList:infos.slides,
              articles:infos.news
          })
      }
      
  }).catch(err =>console.log(err))

},

// 管理分类标签
manageTabs(){
  wx.navigateTo({ url:'/pages/news/manage' })
}
})
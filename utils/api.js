// API DOMAIN
// JSON 文件见 mock 文件夹
// const DOMAIN = 'http://localhost:8080/mock'
const DOMAIN = 'https://h5.ahmq.net/demo/miniapp-static-api/mock'

// 对get命令的封装
export function get (url, data){
  return request(url, 'GET', data)
}
// 对post命令的封装
export function post (url, data){
  return request(url, 'POST', data)
}
// 对request命令的封装
// 其中api就是url，在这里其实相当于mock中的各个json；
// 此函数就是链接各个mock并进行data的返回封装的；最后与get和post再进行深度的封装
export function request(api, method, data = {}){
  wx.showNavigationBarLoading()
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${DOMAIN}/${api}`,
      data: data,
      method: method,
      dataType: 'json',
      success: function(res){
        wx.hideNavigationBarLoading()
        const data = res.data
        if (data.code) {
          reject(new Error(data.message))
        } else {
          resolve(data.data)
        }
      },
      fail: function(err) {
        wx.hideNavigationBarLoading()
        reject(new Error(err.errMsg))
      }
    })
  })
}

// 获取全部分类列表
// 这段代码的逻辑是将一个数组 subscribeList 转换为一个对象 maped，然后遍历 categorys 数组中的每个元素，根据 maped 对象中的属性来确定每个 category 的 selected 属性的值，表示是否设置过关注。
export async function getCategroyList () {
  // 'api-category-list.json'是我们的mock数据，为各个分类列表的数据

  // 这个是获取所有的类别列表
  const categorys = await get('api-category-list.json')

  // 获取订阅列表
  const subscribeList = await getSubscribeList()

  // 订阅列表制作成一个maped，包含订阅列表中的各属性值，并且都为true
  const maped = Array.isArray(subscribeList) ? subscribeList.reduce((prev, k) => {
    prev[k] = true
    return prev
  }, {}) : null

  // 使用categorys.map进行遍历类别列表
  return categorys.map(category => {
    // 如果maped不为null， 判定(!!maped[category.id])，当前的category的id在订阅maped中是否存在，结果赋给category.selected这个属性，表示这个属性是否被选择（订阅）
    // 而如果maped为null，则设置category.selected为false
    category.selected = maped ? (!!maped[category.id]) : true
    return category
  })
}
// 定义一个SubscribeListCacheKey的常量，表示关注列表在存储中的键名；
const $SubscribeListCacheKey = '$SubscribeList'
// 读取关注列表
export function getSubscribeList () {
  return new Promise(resolve => {
    // 调用微信官方函数获取存储中的数据
    wx.getStorage({
      key: $SubscribeListCacheKey,
      // 以下是Promise对象的异步操作结果的处理：
      success: e => resolve(e.data), // 将获取到的data传给resolve， 同时将Promise对象设置为resolve已完成；
      fail: () => resolve(null)
    })
    // resolve这个东西是决定最后的Promise返回状态及数据的关键,上面的success中的e的作用也是为了给resolve(e.data)复赋值!
  })
}

// 保存关注列表
export function saveSubscribeList (subscribeList) {
  return new Promise((resolve, reject) => {
    wx.setStorage({ // 将关注列表存储到本地
      key: $SubscribeListCacheKey,
      data: subscribeList,
      success: resolve, // 当存储操作结束时Promise对象设置为已完成
      fail: e => reject(new Error(e.errMsg))
    })
  })
}

// 加载轮播图
export async function getHomeBannerList () {
  // 很简单的多层包装,最后得到的是轮播图中的data的json
  return await get('api-banners.json')
}

// 根据分类和页码加载数据：模拟的数据重新打乱
export async function getNewsByCategory (categoryId, pageId = 1) {
  // data接收返回数据
  const data = await get(`api-news-list.json`, { categoryId, pageId }) // 这里实际上没有实现categoryId相关的判断,就是对新闻没有分类
  // Math.random()生成一个0-1的随机数,sort为排序;
  // (a,b)是比较函数,最终会使得比较函数的值返回在-0.5和0.5实现打乱数组的目的
  // 最后，函数返回经过排序的新闻数据，即乱序的新闻列表
  return data.sort((a, b) => 0.5 - Math.random())
}

// 订阅频道列表
export async function getSubscribeChannels () {
  return await get('api-subscibe-list.json')
}

// 获取文章详情
export async function getArticleDetail (articleId) {
  return await get('api-news-detail.json', { articleId })
}

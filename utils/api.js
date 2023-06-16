// API DOMAIN
// 这里设定了两个可能的域名，一个是本地的，一个是线上的
// JSON 文件见 mock 文件夹
const DOMAIN = 'http://localhost:8080/mock'

//  const DOMAIN = 'http://127.0.0.1:8080'
//const DOMAIN = 'https://h5.ahmq.net/demo/miniapp-static-api/mock'

// 定义一个通用的get请求函数
export function get(url, data) {
  return request(url, 'GET', data)
}

// 定义一个通用的post请求函数
export function post(url, data) {
  return request(url, 'POST', data)
}

// 获取全部分类列表
// 首先从服务器获取所有的分类，然后再获取用户已经关注的分类
// 最后返回一个新的列表，其中包含用户是否已经关注每一个分类的信息
export async function getCategroyList() {
  const categorys = await get('api-category-list.json') // 从服务器获取所有的分类
  const subscribeList = await getSubscribeList() // 获取用户已经关注的分类
  const maped = Array.isArray(subscribeList) ? subscribeList.reduce((prev, k) => {
    prev[k] = true
    return prev
  }, {}) : null
  return categorys.map(category => {
    category.selected = maped ? (!!maped[category.id]) : true // 如果用户已经关注了这个分类，那么在返回的列表中标记为已关注
    return category
  })
}

// 小程序的本地存储的key，用于存储用户关注的分类
const $SubscribeListCacheKey = '$SubscribeList'

// 获取用户关注的分类列表
export function getSubscribeList() {
  return new Promise(resolve => {
    wx.getStorage({
      key: $SubscribeListCacheKey,
      success: e => resolve(e.data),
      fail: () => resolve(null)
    })
  })
}

// 保存用户关注的分类列表
export function saveSubscribeList(subscribeList) {
  return new Promise((resolve, reject) => {
    wx.setStorage({
      key: $SubscribeListCacheKey,
      data: subscribeList,
      success: resolve,
      fail: e => reject(new Error(e.errMsg))
    })
  })
}

// 获取首页的轮播图
export async function getHomeBannerList() {
  return await get('api-banners.json')
}

// 根据分类和页码加载数据
// 模拟的数据重新打乱
export async function getNewsByCategory(categoryId, pageId = 1) {
  const data = await get(`api-news-list.json`, {
    categoryId,
    pageId
  })
  return data.sort((a, b) => 0.5 - Math.random()) // 随机打乱获取的新闻列表
}

// 获取用户订阅的频道列表
export async function getSubscribeChannels() {
  return await get('api-subscibe-list.json')
}

// 获取用户收藏列表
// export async function getFavoritesByUsername() {
//   return await get('api-favorite-list.json')
// }
export async function getFavoritesByUsername(nickname) {
  const allFavorites = await get('api-favorite-list.json')
  console.log(typeof allFavorites)
  console.log(allFavorites)
  const favoritesByNickname = allFavorites.filter(item => item.nickname === nickname)
  console.log(favoritesByNickname)
  return favoritesByNickname
}

// 获取文章的详细信息
export async function getArticleDetail(articleId) {
  return await get('api-news-detail.json', {
    articleId
  })
}

// 定义一个通用的请求函数
// 这个函数接受三个参数：请求的url，请求的方法，以及请求的数据
// 这个函数会先显示一个加载条，然后发送请求
// 请求成功后，会隐藏加载条，然后判断请求的结果是否成功
// 如果成功，那么返回请求的数据，否则抛出一个错误
export function request(api, method, data = {}) {
  wx.showNavigationBarLoading() // 显示加载条
  return new Promise((resove, reject) => {
    wx.request({
      url: `${DOMAIN}/${api}`,
      data: data,
      method: method,
      dataType: 'json',
      success: function (res) {
        wx.hideNavigationBarLoading() // 隐藏加载条
        const data = res.data
        if (data.code) {
          reject(new Error(data.message)) // 如果服务器返回的code不为0，那么说明请求失败，抛出一个错误
        } else {
          resove(data.data) // 如果服务器返回的code为0，那么说明请求成功，返回请求的数据
        }
      },
      fail: function (err) {
        wx.hideNavigationBarLoading() // 隐藏加载条
        reject(new Error(err.errMsg)) // 如果请求失败，那么抛出一个错误
      }
    })
  })
}
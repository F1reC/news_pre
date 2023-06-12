底部菜单实现：
<!-- 底部视图 -->
<view class="weui-footer">
 <!-- 链接到微信的导航器 -->
        <navigator url="" class="weui-footer__link">Wechat</navigator>
样式定义在app.wxss
应用资源链接在app.json
"list": [
      {
        "pagePath": "pages/news/index",
        "iconPath": "image/icon-news.png",
        "selectedIconPath": "image/icon-news-b.png",
        "text": "新闻"
      },
      {
        "pagePath": "pages/subscibe/index",
        "iconPath": "image/icon-sub.png",
        "selectedIconPath": "image/icon-sub-a.png",
        "text": "订阅"
      },
      {
        "pagePath": "pages/found/index",
        "iconPath": "image/icon-like.png",
        "selectedIconPath": "image/icon-like-a.png",
        "text": "发现"
      },
      {
        "pagePath": "pages/user/index",
        "iconPath": "image/icon-user.png",
        "selectedIconPath": "image/icon-user-a.png",
        "text": "我的"
      }
    ]
图标更改可以去网上查

    news上面的导航页在news/manage.wxml里
     <view class="manage__bd">
            // 遍历已选择的频道列表
            <block wx:for="{{ categoryList }}" wx:key="id" wx:if="{{ item.selected }}">
            categorylist没找到在哪



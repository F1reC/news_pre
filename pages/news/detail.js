const { getArticleDetail, getNewsByCategory } = require("../../utils/api")

Page({
    data:{
        article:{},
        tagStyle: {
            img: "display: block; width: 100%; height: auto;",
            h2: "margin: 10px 0",
        },
        relations: [],
        showFloatingButton:true,
        isContentLoaded: false,
        screenHeight: 0,
        contentHeight: 0,
    },
    onLoad:function({ id }){
        this.refreshArticle(id)
        this.refreshRelationArticles()
        // get system info to calculate screen height
        wx.getSystemInfo({
          success: (res) => {
              this.setData({
                  screenHeight: res.windowHeight
              });
          }
        });

        

    },
    async refreshArticle (id) {
        const article = await getArticleDetail(id)
        this.setData( { article,
          isContentLoaded: true,
         } )
        // after setting the article, get its height
        if (this.data.isContentLoaded) {
          var query = wx.createSelectorQuery();
          query.select('.article__content').boundingClientRect();
          query.exec((res) => {
                if (res[0]) {
                  this.setData({
                    contentHeight: res[0].height
                  });
                } else {
                console.error('Cannot find element with class name .article-content');
                }
            });
        }
        
    },
    async refreshRelationArticles () {
        const relations = await getNewsByCategory(0)
        this.setData({ relations })
    },

    onPageScroll: function(e) {
      // if scrolled to the bottom
      if(e.scrollTop-this.data.screenHeight>=(this.data.contentHeight - 300)) {
          this.setData({
              showFloatingButton: false
          });
      } else {
          this.setData({
              showFloatingButton: true
          });
      }
  },

})
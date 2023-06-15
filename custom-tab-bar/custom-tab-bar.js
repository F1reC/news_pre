Component({
  properties: {
    tabBarList: {
      type: Array,
      value: []
    },
    selectedColor: {
      type: String,
      value: '#d81e06'
    }
  },
  methods: {
    switchTab(e) {
      const index = e.currentTarget.dataset.index;
      wx.switchTab({
        url: this.data.tabBarList[index].pagePath
      });
    }
  }
});

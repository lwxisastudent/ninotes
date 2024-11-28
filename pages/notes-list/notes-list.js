// pages/notes-list/notes-list.js
Page({
  data: {
    articles: [],
    page: 1,
    isLoading: false,
    hasMore: true // 用于判断是否还有更多数据
  },

  onLoad() {
    this.loadArticles();
  },

  loadArticles() {
    if (this.data.isLoading || !this.data.hasMore) return; // 如果正在加载或没有更多数据，直接返回

    this.setData({ isLoading: true });

    wx.request({
      url: `https://notes.lawaxi.net/api/GetAllArticles?page=${this.data.page}`,
      method: 'GET',
      header: {
        'Cookie': wx.getStorageSync('cookies')
      },
      success: (res) => {
        const articles = res.data || [];
        this.setData({
          articles: this.data.articles.concat(articles),
          page: this.data.page + 1,
          isLoading: false,
          hasMore: articles.length === 20 // 如果返回的文章数少于20，表示没有更多数据
        });
      },
      fail: () => {
        this.setData({ isLoading: false });
      }
    });
  },

  onPullDownRefresh() {
    this.setData({ page: 1, articles: [], hasMore: true }); // 重置分页和数据
    this.loadArticles();
    wx.stopPullDownRefresh();
  },

  onReachBottom() {
    this.loadArticles();
  },

  onArticleClick(event) {
    const articleId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/notes-edit/notes-edit?id=${articleId}`
    });
  }
});

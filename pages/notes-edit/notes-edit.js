// pages/notes-edit/notes-edit.js
Page({
  data: {
    id: 0,
    title: '',
    category: '',
    tags: [],
    body: '',
  },

  onLoad(options) {
    if (options.id != 0) {
      this.setData({ id: options.id });
      this.fetchArticle(options.id);

      wx.setNavigationBarTitle({
        title: `Ninotes/${options.id}`,
      });
    }
  },

  fetchArticle(id) {
    wx.request({
      url: `https://notes.lawaxi.net/api/articles/${id}`,
      method: 'GET',
      header: {
        'Cookie': wx.getStorageSync('cookies')
      },
      success: (res) => {
        const article = res.data;
        this.setData({
          title: article.title || '',
          category: article.category ? article.category.name : '',
          tags: article.tags ? article.tags.map(tag => tag.name): [],
          body: article.body || ''
        });
      }
    });
  },

  onSave() {
    const { title, category, tags, body, id } = this.data;
    const data = {
      title,
      body,
      category: category === '' ? null : category,
      tags: tags.length === 0 ? null : tags,
      type: 0
    };

    const url = id === 0
      ? 'https://notes.lawaxi.net/api/WriteNewArticle'
      : `https://notes.lawaxi.net/api/WriteArticle/${id}`;

    wx.request({
      url,
      method: 'POST',
      data,
      header: {
        'Cookie': wx.getStorageSync('cookies')
      },
      success: (res) => {
        if (res.data.message) {
          wx.showToast({ title: '保存成功', icon: 'none' });
          
          if(id === 0){
            this.setData({ id: res.data.id });
            wx.setNavigationBarTitle({
              title: `Ninotes/${this.data.id}`,
            });
          }
          
          const pages = getCurrentPages();
          const previousPage = pages[pages.length - 2];
          previousPage.onPullDownRefresh();
        }
      }
    });
  },

  onTitleChange(event) {
    this.setData({ title: event.detail.value });
  },

  onCategoryChange(event) {
    this.setData({ category: event.detail.value });
  },

  onTagsChange(event) {
    this.setData({ tags: event.detail.value });
  },

  onBodyChange(event) {
    this.setData({ body: event.detail.value });
  },

  scrollToTop() {
    wx.pageScrollTo({scrollTop: 0});
  },

  scrollToBottom() {
    wx.pageScrollTo({scrollTop: 999999});
  },
});

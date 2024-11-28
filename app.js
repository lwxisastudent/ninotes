// app.js
App({
  globalData: {
    userInfo: null,
    autoLogin: false
  },

  onLaunch() {
    const autoLogin = wx.getStorageSync('autoLogin');
    this.globalData.autoLogin = autoLogin;
    if (autoLogin) {
      const email = wx.getStorageSync('email');
      const password = wx.getStorageSync('password');
      this.login(email, password);
    }
  },

  login(email, password) {
    wx.request({
      url: 'https://notes.lawaxi.net/api/login',
      method: 'POST',
      data: { email, password },
      success: (res) => {
        if (res.data.user_id) {
          if (this.globalData.autoLogin) {
            wx.setStorageSync('autoLogin', true);
            wx.setStorageSync('email', email);
            wx.setStorageSync('password', password);
          } else {
            wx.setStorageSync('autoLogin', false);
            wx.removeStorageSync('email');
            wx.removeStorageSync('password');
          }

          const cookies = res.cookies.join('; ');
          wx.setStorageSync('cookies', cookies);
          wx.navigateTo({ url: '/pages/notes-list/notes-list' });
        } else {
          wx.showToast({
            title: res.data.error,
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络请求失败，请稍后再试',
          icon: 'none'
        });
      }
    });
  }
});

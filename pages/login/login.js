// pages/login/login.js
Page({
  data: {
    email: '',
    password: '',
    autoLogin: false
  },

  onEmailChange(event) {
    this.setData({ email: event.detail.value });
  },

  onPasswordChange(event) {
    this.setData({ password: event.detail.value });
  },

  onAutoLoginChange(event) {
    this.setData({ autoLogin: !this.data.autoLogin });
  },

  onLogin() {
    const { email, password, autoLogin } = this.data;
    const app = getApp();
    app.globalData.autoLogin = autoLogin;
    app.login(email, password);
  },

  onLoad() {
    const email = wx.getStorageSync('email');
    const password = wx.getStorageSync('password');
    const autoLogin = wx.getStorageSync('autoLogin');
    if (autoLogin) {
      this.setData({ email, password, autoLogin: true });
    }
  }
});

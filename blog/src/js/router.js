function Router() {
  // 路由储存
  this.routes = {};
  // 当前路由
  this.currentUrl = '';
  // 上一个路由
  this.oldUrl = '';
  // 路由改变后执行的函数
  this.globalCb = function () { }
}

Router.prototype = {
  // 路由处理
  route: function (path, callback) {
    this.routes[path] = callback || function () { };
  },
  // 页面刷新
  refresh: function (e) {
    var oldUrl = e.oldURL;
    this.oldUrl = oldUrl ? oldUrl.substr(oldUrl.indexOf('#') + 1) : ''
    // 当前的hash值
    this.currentUrl = location.hash.slice(1) || '/';
    // 执行hash值改变后相对应的回调
    this.routes[this.currentUrl] && this.routes[this.currentUrl]();
    this.globalCb();
  },
  // 页面初始化
  init: function (cb) {
    this.globalCb = cb || function () { };
    window.addEventListener('load', this.refresh.bind(this), false);
    window.addEventListener('hashchange', this.refresh.bind(this), false);
  },
  push: function (route) {
    window.location.href = this.getUrlWithoutHash() + '#' + route;
  },
  getCurrent: function () {
    return this.currentUrl;
  },
  getOld: function () {
    return this.oldUrl;
  },
  getUrlWithoutHash: function () {
    var protocol = window.location.protocol
    var host = window.location.host
    var port = window.location.port
    var pathname = window.location.pathname
    return protocol + '//' + host + pathname;
  }
}

// 全局挂载
window.Router = new Router();
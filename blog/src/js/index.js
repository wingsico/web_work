

(function () {

  var categories = document.querySelectorAll('.category');
  var iframe = document.getElementById('partical');

  // 初始化
  Router.init(globalCallback);


  /** utils */

  function changeTitle(title) {
    document.title = title;
  }

  function setIframeHeight(iframe) {
    if (iframe) {
      iframe.style.height = 0;
      var iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
      var bHeight = iframeWin.document.body.scrollHeight;
      var dHeight = iframeWin.document.documentElement.scrollHeight;
      var height = Math.max(bHeight, dHeight);
      iframe.style.height = height + 'px';
    }
  };























  /**
   * 监听路由
   */

  Router.route('/', function () {
    Router.push('/home');
  })

  Router.route('/home', function () {
    changeTitle('Home')
  })

  /**
   * 路由回调
   */

  function globalCallback() {
    var currentRoutes = Router.getCurrent().slice(1).split("/");
    var oldRoutes = Router.getOld().slice(1).split("/");

    oldRoutes.forEach(function (route) {
      document.getElementById(route) && document.getElementById(route).classList.remove('checked');      
    })
    
    currentRoutes.forEach(function (route) {
      document.getElementById(route) && document.getElementById(route).classList.add('checked');
    })

    

    window.frames.partical.location.href = Router.getUrlWithoutHash() + '_particals' + Router.getCurrent() + '.html';
    setIframeHeight(iframe)
  }

  
  iframe.onload = function () {
    setIframeHeight(iframe)
  }

  window.addEventListener('resize', function(){ setIframeHeight(iframe)})
})()
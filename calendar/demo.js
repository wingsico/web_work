const calendar = document.getElementById('container')

window.onload = function () {
  const options = {
    el: calendar,
    // theme: 'pink',
    // language: 'zh',
    // headerHeight: '30px',
    // width: '200px',
    // headerFontSize: '20px',
    // bodyPadding: '5px',
    // shadow: 'none',
  };
  
  spc.init(options);
}
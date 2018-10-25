const calendar = document.querySelector('.calendar');

const form = document.querySelector('.form');

const yearInput = form.querySelector('.year')

const monthInput = form.querySelector('.month')


function checkDateVaild(year, month) {
  return new Promise((resolve, reject) => {
    if (year <= 0 || month <= 0 || month > 12 || year % 1 !== 0 || month % 1 !== 0) {
      reject()
    } else {
      resolve(new Date(year, month - 1, 1));
    }
  })
}

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

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    checkDateVaild(yearInput.value, monthInput.value).then((date) => {
      spc.setDate(date)
    }).catch(() => {
      alert('年份或月份输入了非法的值. 请重试')
    })
  })


}
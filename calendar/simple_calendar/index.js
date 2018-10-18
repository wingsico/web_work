'use strict';

window.spc = (function () {
  /**
   *  config
   *
   */
  const config = {
    languages: [
      'zh', 'en'
    ],
    flatDays: [
      31,
      28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31
    ],
    leapDays: [
      31,
      29,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31
    ],
    ['zh-weeks']: [
      '日',
      '一',
      '二',
      '三',
      '四',
      '五',
      '六'
    ],
    ['en-weeks']: [
      'Sun',
      'Mon',
      'Tue',
      'Wed',
      'Thur',
      'Fri',
      'Sar'
    ],
    mainWrapperCn: 'spc-wrapper',
    headerWrapperCn: 'spc-header',
    bodyWrapperCn: 'spc-body',
    currentLanguage: 'zh'
  }

  /**
   * 全局date
   */

  const dateObj = (function () {
    var _date = new Date() // 默认为当前系统时间
    return {
      getDate: function () {
        return _date
      },
      setDate: function (date) {
        _date = date
      }
    }
  })()

  const _curry = (f, arr = []) => (...args) => (a => a.length === f.length
    ? f(...a)
    : _curry(f, a))([
    ...arr,
    ...args
  ]);

  const _checkEleVaild = (ele) => {
    if (ele instanceof HTMLElement) {
      return ele;
    }
    throw new Error('挂载DOM元素不合法，请检查后再试');
  }

  const _resolveDate = (date) => {
    const _date = new Date(date);
    return {
      year: _date.getFullYear(),
      month: _date.getMonth(),
      day: _date.getDate(),
      week: _date.getDay()
    }
  }

  const _generateChildrenClassName = _curry((parentClassname, suffix) => {
    return parentClassname.includes('__')
      ? `${parentClassname}-${suffix}`
      : `${parentClassname}__${suffix}`;
  })

  const _weekNumberToText = (weekNumber) => {
    const _weekNumber = parseInt(weekNumber);
    return config[`${config.currentLanguage}-weeks`][_weekNumber];
  }

  const _isLeapYear = (year) => {
    const _year = parseInt(year);
    return _year % 400 === 0 || (_year % 4 === 0 && _year % 100 !== 0);
  }

  const _DOMToString = (dom) => {
    const div = document.createElement('div');
    div.appendChild(dom)
    return div.innerHTML;
  }

  const _getMonthDays = (year, month) => {
    return _isLeapYear(year) ? config.leapDays[(month + 12) % 12] : config.flatDays[(month + 12) % 12];
  }

  /**
   * views
  */

  const _generateCalendarHeaderDate = (parentCn) => {
    const dateWrapperCn = _generateChildrenClassName(parentCn, 'date');
    const dateItemWrapperCn = _generateChildrenClassName(dateWrapperCn);

    const yearWrapperCn = dateItemWrapperCn('year')
    const monthWrapperCn = dateItemWrapperCn('month')

    const wrapper = document.createElement('div');

    const children = `
      <span class="${yearWrapperCn}"></span>-<span class="${monthWrapperCn}"></span>
    `

    wrapper
      .classList
      .add(dateWrapperCn);
    wrapper.innerHTML = children;

    return wrapper;
  }

  const _generateCalendarHeader = (date) => {
    const {headerWrapperCn} = config;
    const headerItemWrapperCn = _generateChildrenClassName(headerWrapperCn);

    const wrapper = document.createElement('div');
    const children = `
      <i class="${headerItemWrapperCn('dec')}"><</i>
      ${_DOMToString(_generateCalendarHeaderDate(headerWrapperCn))}
      <i class="${headerItemWrapperCn('inc')}">></i>
    `

    wrapper.innerHTML = children;
    wrapper
      .classList
      .add(headerWrapperCn);
    return wrapper;
  }

  const _generateCalendarBody = () => {
    const {bodyWrapperCn, currentLanguage} = config;
    const bodyTableWrapperCn = _generateChildrenClassName(bodyWrapperCn, 'table');
    const bodyTableTrCn = _generateChildrenClassName(bodyTableWrapperCn);

    const wrapper = document.createElement('div');
    const table = document.createElement('table')
    const bodyWeek = `
      <tr class="${bodyTableTrCn('week')}">
      ${config[`${currentLanguage}-weeks`].map(text => `<th>${text}</th>`).join('')}
      </tr>
    `

    // 一个月最多31天，所以一个月最多占6行表格
    const _date = dateObj.getDate();
    // const _month = _resolveDate(_date).month + 1;
    const lines = 6;
    let bodyDays = '';

    for (let i = 0; i < lines; i++) {
      bodyDays += `
        <tr class="${bodyTableTrCn('line')}">
          <td class="weekend"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td class="weekend"></td>
        </tr>
      `
    }

    table
      .classList
      .add(bodyTableWrapperCn);
    table.innerHTML = bodyWeek + bodyDays;

    wrapper
      .classList
      .add(bodyWrapperCn);
    wrapper.append(table)
    return wrapper;
  }


  
  /**
   * 流程函数
   */

  const _renderHTML = (mountedEle) => {
    const header = _generateCalendarHeader();
    const body = _generateCalendarBody();
    mountedEle.appendChild(header);
    mountedEle.appendChild(body);
  }

  const _renderData = () => {
    // 获取渲染标签所需DOMs
    const calHeaderDateYear = document.querySelector('.spc-header__date-year');
    const calHeaderDateMonth = document.querySelector('.spc-header__date-month');
    const calBodyTable = document.querySelector('.spc-body__table');
    const calBodyTableCells = calBodyTable.querySelectorAll('td');

    // 获取当前选中日期
    const date = dateObj.getDate();
    const resolvedDate = _resolveDate(date)
    const { year, month } = resolvedDate;
    const { year: cYear, month: cMonth, day: cDay } = _resolveDate(new Date());

    // 设置顶部日期
    calHeaderDateYear.innerText = year;
    calHeaderDateMonth.innerText = month + 1 >= 10 ? month + 1 : `0${month + 1}`;
    
    // 设置表格中的日期数据
    
    const dayOfWeekAboutFirstDayThisMonth = _resolveDate(new Date(year, month, 1)).week;
    const lastMonthDays = _getMonthDays(year, month - 1);
    const curMonthDays = _getMonthDays(year, month);

    let curDay = (lastMonthDays - dayOfWeekAboutFirstDayThisMonth) % lastMonthDays + 1;
    calBodyTableCells.forEach((cell, index) => {
      if (index < dayOfWeekAboutFirstDayThisMonth) {
        cell.classList.add('other-month')
      }

      if (index === dayOfWeekAboutFirstDayThisMonth) {
        curDay = 1;
      }

      cell.innerText = curDay;
      cell.classList.add('cur-month')
      curDay === cDay && month === cMonth && year === cYear && cell.classList.add('today');
      curDay += 1;
      
      if (!cell.classList.contains('other-month') && curDay > curMonthDays) {
        curDay = 1;
        cell.classList.add('other-month')
      }
    })
  }


    /**
   * event listeners
   */

  const _switchSetDate = (date) => {
    dateObj.setDate(new Date(date));
    _renderData()
  }

  const _incButtonClick = (e) => {
    const checkedDate = dateObj.getDate();
    const { year, month } = _resolveDate(checkedDate);
    const nextMonthDate = new Date(year, month + 1, 1);
    _switchSetDate(nextMonthDate)
  }

  const _decButtonClick = (e) => {
    const checkedDate = dateObj.getDate();
    const { year, month } = _resolveDate(checkedDate);
    const preMonthDate = new Date(year, month - 1, 1);
    _switchSetDate(preMonthDate)
  }

 


  const _bindEvents = () => {
    const decButton = document.querySelector('.spc-header__dec');
    const incButton = document.querySelector('.spc-header__inc');
    
    decButton.addEventListener('click', _decButtonClick)
    incButton.addEventListener('click', _incButtonClick)
  }

  /**
   * 初始化
   * @param {HTMLElement} mountedEle
   * @param {Object} options
   */

  const _init = (mountedEle, options) => {

    _checkEleVaild(mountedEle);

    _renderHTML(mountedEle);

    _renderData();

    _bindEvents();
  }

  return {
    init: _init,
    setDate: _switchSetDate,
    getDate: dateObj.getDate,
  }
})()

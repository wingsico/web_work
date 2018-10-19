'use strict';

window.spc = (function () {
  /**
   *  config
   *
   */
  let config = {
    languages: [
      'zh', 'en'
    ],
    flatDays: [
      31,28,31,30,31,30,31,31,30,31,30,31
    ],
    leapDays: [
      31,29,31,30,31,30,31,31,30,31,30,31
    ],
    ['zh-weeks']: ['日','一','二','三','四','五','六'],
    ['en-weeks']: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May' ,'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    mainWrapperCn: 'spc-wrapper',
    headerWrapperCn: 'spc-header',
    bodyWrapperCn: 'spc-body',
    currentLanguage: 'en',
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

    const wrapper = document.createElement('span');

    const children = `
    <span class="${monthWrapperCn}"></span>&nbsp; <span class="${yearWrapperCn}"></span>
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
      <span class="${headerItemWrapperCn('dec')} spc-icon spc-icon-left"></span>
      ${_DOMToString(_generateCalendarHeaderDate(headerWrapperCn))}
      <span class="${headerItemWrapperCn('inc')} spc-icon spc-icon-right"></span>
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
      ${config[`${currentLanguage}-weeks`].map(text => `<td>${text}</td>`).join('')}
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

  const _generateCalendar = () => {
    const header = _generateCalendarHeader();
    const body = _generateCalendarBody();
    const wrapper = document.createElement('div');

    wrapper.classList.add(config.mainWrapperCn);
    wrapper.appendChild(header);
    wrapper.appendChild(body);

    return wrapper;
  }


  
  /**
   * 流程函数
   */

  const _renderHTML = (mountedEle) => {
    const calendar = _generateCalendar();
    mountedEle.appendChild(calendar);
  }

  const _renderData = () => {
    // 获取渲染标签所需DOMs
    const calHeaderDateYear = document.querySelector('.spc-header__date-year');
    const calHeaderDateMonth = document.querySelector('.spc-header__date-month');
    const calBodyTable = document.querySelector('.spc-body__table');
    const calBodyTableCells = calBodyTable.querySelectorAll('.spc-body__table-line td');

    // 获取当前选中日期
    const date = dateObj.getDate();
    const resolvedDate = _resolveDate(date)
    const { year, month } = resolvedDate;

    // 今日日期
    const { year: cYear, month: cMonth, day: cDay } = _resolveDate(new Date());

    // 设置顶部日期
    calHeaderDateYear.innerText = year;
    calHeaderDateMonth.innerText = config.months[(month + 12)%12];
    
    // 设置表格中的日期数据
    
    const dayOfWeekAboutFirstDayThisMonth = _resolveDate(new Date(year, month, 1)).week;
    const lastMonthDays = _getMonthDays(year, month - 1); // 上个月的天数
    const thisMonthDays = _getMonthDays(year, month); // 这个月的天数

    // 第一格的日期值
    const _f = (lastMonthDays - dayOfWeekAboutFirstDayThisMonth) % lastMonthDays + 1;
    console.log(_f + ',' + dayOfWeekAboutFirstDayThisMonth);
    // 当前格子的日期值 默认为第一格的日期值
    let curTableCellDate = _f;

    // 简写
    let _d = dayOfWeekAboutFirstDayThisMonth;
    let _l = lastMonthDays;
    let _c = curTableCellDate;
    let _t = thisMonthDays;

    calBodyTableCells.forEach((cell, _i) => {
      cell.classList.remove('o-month', 'today');

      // 非本月
      (_i < _d || _i >= _d + _t) && cell.classList.add('o-month');

      // 当前格子的日期值
      
      _c = _i + _d === 0 ? 1 : _i < _d ? _f + _i : ((_i < _d + _t)  ? _f + _i - (_d === 0 ? 0: _l) : _f + _i - _l - _t);

      // 是否为今日
      _c === cDay && month === cMonth && year === cYear && cell.classList.add('today');
      
      cell.innerText = _c;
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

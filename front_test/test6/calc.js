(function (global) {
  /**
   * 变量定义
   */
  const numberBoard = document.querySelector('.number-board'); // 键盘区域
  const currentInputWrapper = document.querySelector('.current-input-wrapper'); // 当前输入区域
  const historyInputWrapper = document.querySelector('.history-input-wrapper'); // 输入历史区域
  const mulChar = '×';
  const funcKeys = ['C', '←', '()', '=', '-', '+', mulChar, '÷', '%', 'sin', 'cos', 'tan', 'lg', 'ln', 'e', 'π', '√', 'x^2', 'x^y']; // 功能键
  const operates = ['+', '-', mulChar, '÷', '%']; // 操作符
  const constants = ['e', 'π']; // 常量
  const maxLength = 20; // 单个数字的最长长度
  let brackets = []; // 括号栈，记录括号对
  let numberLength = 0; // 目前输入的数字的长度
  let reInputFlag = false; // 接下来是否清除输入区域并打印到历史
  let errorID = 'error';

  // 功能键与功能函数的映射
  const funcKeysMap = {
    'C': clear,
    '←': backspace,
    '()': addBrackets,
    '=': calc,
    '-': addOperation('-'),
    '+': addOperation('+'),
    [mulChar]: addOperation(mulChar),
    '÷': addOperation('÷'),
    '%': addOperation('%'),
    'sin': addFunction('sin'),
    'cos': addFunction('cos'),
    'tan': addFunction('tan'),
    '√': addFunction('√'),
    'x^2': addFunction('^', '2'),
    'x^y': addFunction('^', false),
    'lg': addFunction('lg'),
    'ln': addFunction('ln'),
    'π': addConstant('π'),
    'e': addConstant('e'),
  }

  // 特殊字符的映射
  const replaceMap = {
    [mulChar]: '*',
    '÷': '/',
    'sin': 'Math.sin',
    'cos': 'Math.cos',
    'tan': 'Math.tan',
    'lg': 'Math.log10',
    'ln': 'Math.log',
    'e': 'Math.E',
    'π': 'Math.PI',
    '√': 'Math.sqrt',
  }

  /**
   * 逻辑函数
   */


  /**
   * 清除 - funcKeys
   * 当输入区域有字符时，清除输入区域，否则，清除历史区域
   */
  function clear() {
    if (!!currentInputWrapper.innerText) {
      currentInputWrapper.innerText = "";
    } else {
      historyInputWrapper.innerText = "";
    }
    brackets = [];
    numberLength = 0;
    reInputFlag = false;
  }

  /**
   * 退格 - funcKeys
   * 使用slice，保留第一个字符到倒数第二个字符组成的字符串
   */
  function backspace() {
    const lastChar = currentInputWrapper.innerText.slice(-1);
    // 处理退格删除括号问题
    (lastChar === ')' || lastChar === '(') && lastChar === '(' ? brackets.pop() : brackets.push(false);
    currentInputWrapper.innerText = currentInputWrapper.innerText.slice(0, -1);
  }

  /**
   * 加入括号 - funcKeys
   * 自动匹配左右括号
   */
  function addBrackets() {
    const input = currentInputWrapper.innerText;
    const prevChar = input.substr(-1); // 当前输入的最后一个字符
    if (operates.includes(prevChar) || prevChar === "" || prevChar === "(") {
      currentInputWrapper.innerText += '(';
      brackets.push(false); // 推入false到栈顶表示待匹配的左括号
    } else if ((isNumber(prevChar) || prevChar === ')') && !brackets.includes(false)) {
      currentInputWrapper.innerText += mulChar + '('; // 默认加上乘号，防止出现 9( 之类的式子
      brackets.push(false);
    } else if (brackets.includes(false)) {
      brackets.pop(); // 移除栈顶左括号标识
      currentInputWrapper.innerText += ')';
    }
  }

  function calc() {
    const input = currentInputWrapper.innerText;
    try {
      // 修正需要计算的式子，利用replaceMap将对应的可计算的值映射到原字符
      const formatInput = powerHandler(Object.keys(replaceMap).reduce((acc, cur) => acc.replace(cur, replaceMap[cur]), input))
      console.log(formatInput)
      const result = eval(`(${formatInput}).rounded()`); // 使用eval计算 (这一步可能抛出错误)
      if (input != result) { // 防止重复按 = 号重复写入历史记录
        addHistory(input);
      }
      currentInputWrapper.innerText = result;
    } catch (e) {
      console.log(`[error]: ${input} is not a vaild formula`)
      console.log(e)
      addHistory(input);
      currentInputWrapper.innerText = errorID;
    } finally {
      // 标识一个式子已经计算完成，需要另起一个式子来计算，标识接下来的操作是另一个计算。
      reInputFlag = true;
    }
  }


  function addOperation(key) {
    return function () {
      const input = currentInputWrapper.innerText;
      const prevChar = input.substr(-1);
      if (operates.includes(prevChar)) {
        currentInputWrapper.innerText = input.slice(0, -1) + key;
      } else {
        currentInputWrapper.innerText = input + key;
      }
    }
  }

  function addFunction(key, power) {
    return function () {
      const input = currentInputWrapper.innerText;
      const prevChar = input.substr(-1);
      if (key === '^') {
        if (power === false) {
          currentInputWrapper.innerText += `${key}(`;
          brackets.push(false)
        } else {
          currentInputWrapper.innerText += `${key}(2)`;
        }
        return;
      }
      if (operates.includes(prevChar) || prevChar == "" || prevChar == "(") {
        currentInputWrapper.innerText += `${key}(`
      } else {
        currentInputWrapper.innerText += `${mulChar}${key}(`;
      }
      brackets.push(false)
    }
  }

  function addConstant(key) {
    return function () {
      const input = currentInputWrapper.innerText;
      const prevChar = input.substr(-1);
      if (operates.includes(prevChar) || prevChar == "" || prevChar == "(") {
        currentInputWrapper.innerText += `${key}`
      } else {
        currentInputWrapper.innerText += `${mulChar}${key}`;
      }
    }
  }

  function addHistory(result) {
    const history = document.createElement('p');
    history.innerText = result;
    historyInputWrapper.appendChild(history)
  }


  function concatFormulaHandler(e) {
    const key = e.target.getAttribute("key");
    if (key === null) {
      return;
    }

    if (funcKeys.includes(key)) {
      reInputFlag = false;
      numberLength = 0;

      funcKeysMap[key]();
      return;
    }

    if (numberLength >= maxLength - 1) {
      return;
    }

    if (reInputFlag) {
      currentInputWrapper.innerText !== errorID && addHistory(currentInputWrapper.innerText);
      currentInputWrapper.innerText = "";
      reInputFlag = !reInputFlag;
    }

    numberLength++;
    const prevChar = currentInputWrapper.innerText.substr(-1);
    currentInputWrapper.innerText += [...constants, ')'].includes(prevChar) ? `${mulChar}${key}` : key;
  }

  function powerHandler(formula) {
    let powerIndex = formula.lastIndexOf('^');
    if (powerIndex !== -1) {
      const prevChar = formula.charAt(powerIndex - 1);
      const nextChar = formula.charAt(powerIndex + 1);
      let leftChildFormula = '';
      let rightChildFormula = '';
      let leftIndex = 0;
      let rightIndex = formula.length - 1;

      if (prevChar === ')') {
        const leftBracketIndex = formula.lastIndexOf('(', powerIndex);
        leftChildFormula = formula.slice(leftBracketIndex, powerIndex);

        leftIndex = leftBracketIndex;
      } else {
        const reverseLeft = formula.slice(0, powerIndex).split('').reverse();
        const reverseFirstNaNCharIndex = reverseLeft.findIndex((value) => !isNumber(value));
        const firstNaNCharIndex = reverseFirstNaNCharIndex === -1 ? -1 : powerIndex - 1 - reverseFirstNaNCharIndex;
        leftChildFormula = formula.slice(firstNaNCharIndex + 1, powerIndex);

        leftIndex = firstNaNCharIndex + 1;
      }

      if (nextChar === '(') {
        const rightBracketIndex = powerIndex + findRightestBracketIndex(formula.slice(powerIndex));
        rightChildFormula = formula.slice(powerIndex + 1, rightBracketIndex + 1);
        rightIndex = rightBracketIndex;
      } else {
        const firstNaNCharIndex = powerIndex + 1 + formula.slice(powerIndex + 1).split('').findIndex(value => !isNumber(value))
        rightChildFormula = formula.slice(powerIndex + 1, firstNaNCharIndex);
        rightIndex = firstNaNCharIndex;
      }

      const childFormula = `(Math.pow(${leftChildFormula}, ${rightChildFormula}))`;
      const newFormula = `${formula.slice(0, leftIndex)}${childFormula}${formula.slice(rightIndex + 1)}`
      console.log(newFormula);
      return powerHandler(newFormula)
    } else {
      return formula;
    }
  }



  /**
   * 工具函数
   */

  Number.prototype.rounded = function (i) {
    i = Math.pow(10, i || 15);
    // default
    return Math.round(this * i) / i;
  }

  function isNumber(char) {
    return /\d/.test(char);
  }

  function findRightestBracketIndex(formula) {
    var index = 0;
    var flag = false;
    var m = 0;

    while (index < formula.length) {
      if (formula.charAt(index) === '(') {
        flag = true;
        m++;
      } else if (formula.charAt(index) === ')') {
        m--;
      }

      if (flag === true && m === 0) {
        break;
      }
      index++;
    }

    return index;
  }










  /**
   * 事件监听
   */
  numberBoard.addEventListener('click', inputNumber);
  global.addEventListener('touchstart', active)
  global.addEventListener('touchend', removeActive);
  global.addEventListener('mousedown', active);
  global.addEventListener('mouseup', removeActive);


  /**
   * 事件处理函数
   */
  function inputNumber(e) {
    concatFormulaHandler(e);
  }

  function active(e) {
    const target = e.target;
    target.classList.add('active');
  }

  function removeActive(e) {
    const target = e.target;
    target.classList.remove('active');
  }
})(window)

# Calendar

## 介绍

这是一个前端作业（的升级版）

写了一个叫做 simple_calendar 的小插件，并拥有一些简单的配置项以及接口方法。

## Simple_calendar

### 配置项

```js
{
  el: $el, // 日历挂载的父节点，必选项
  theme: '#499DFF', // 主题颜色，可选
  language: 'en', //  'en' | 'zh' 国际化 可选
  headerHeight: '100px', // 日历头部高度 可选
  width: '300px', // 日历宽度 可选
  headerFontSize: '20px', // 日历头部字体大小 可选
  bodyPadding: '5px', // 日历主题内边距 可选
  shadow: true, // 日历整体阴影， 是否开启 可选
}
```

### 接口方法

* `init` : 初始化日历，需要传入配置项
* `getDate`: 获取日历当前日期，返回 `Date` 实例
* `setDate`: 设置日历当前日期，传入合法的日期字符串或者 `Date` 实例

### 使用方法

```js
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
```


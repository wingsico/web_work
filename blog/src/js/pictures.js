window.onload = function () {
  var wrapper = document.querySelector('.picture-wrapper');
  var items = document.querySelectorAll('.image-item');
  
  var gap = 18;

  function waterFall() {
    var pageWidth = parseInt(getComputedStyle(wrapper).width);
    var itemWidth = items[0].offsetWidth;
    var columns = parseInt(pageWidth / (itemWidth + gap));
    var arr = [];

    // if (columns === 1) {
    //   items.forEach(function (item) {
    //     item.classList.add('image-item-col-1');
    //   })
    // } else {
    //   items.forEach(function (item) {
    //     item.classList.remove('image-item-col-1');
    //   })
    // }

    

    for (var i = 0; i < items.length; i++) {
      if (i < columns) {
        items[i].style.top = 0;
        items[i].style.left = (itemWidth + gap) * i + 'px';
        arr.push(items[i].offsetHeight);

      } else {
        var minHeight = arr[0];
        var index = 0;
        for (var j = 0; j < arr.length; j++) {
          if (minHeight > arr[j]) {
            minHeight = arr[j];
            index = j;
          }
        }

        items[i].style.top = arr[index] + gap/2 + 'px';
        items[i].style.left = items[index].offsetLeft + 'px';
        arr[index] = arr[index] + items[i].offsetHeight + gap;
      }
    }
  }

  waterFall();

  window.addEventListener('resize', waterFall, false);
}


(function () {
  const canvas = document.createElement("canvas");

  const ctx = canvas.getContext('2d');

  let wWidth = window.innerWidth;
  let wHeight = window.innerHeight;
  let snows = [];
  let total = 500;

  function generateRandomSnow() {
    return new Snow(Utils.random(0, wWidth), Utils.random(0, wHeight), Utils.random(1, 3), Utils.random(-6, 6));
  }



  function draw() {
    ctx.clearRect(0, 0, wWidth, wHeight);
    ctx.save();

    for (let i = 0; i < total; i++) {
      let snow = snows[i];
      let h = snow.scale * 0.5;
      let left = snow.left + Math.tan(Utils.radian(snow.deg)) * h / 2;
      let top = snow.top + h;

      snow = new Snow(left, top, snow.scale, snow.deg);
      snows[i] = snow;

      if (!Utils.isInViewport(snow)) {
        snows.splice(i--, 1);
        snows.push(new Snow(Utils.random(0, wWidth), 0, Utils.random(1, 3), Utils.random(-6, 6)))
        continue;
      }

      let scale = snow.scale;
      let ra = ctx.createRadialGradient(snow.left, snow.top, scale / 4, snow.left, snow.top, scale);
      ra.addColorStop(0, "rgba(255,255,255,0.8)");
      ra.addColorStop(1, "rgba(255,255,255,0.1)");

      ctx.fillStyle = ra;
      ctx.beginPath();
      ctx.arc(snow.left, snow.top, scale , 0, 2 * Math.PI);
      ctx.fill();
    }

    ctx.restore();
    requestAnimationFrame(draw);
  }

  function init() {
    canvas.setAttribute("width", wWidth);
    canvas.setAttribute("height", wHeight);
    canvas.setAttribute("id", "snow");
    document.body.appendChild(canvas);

    for (let i = 0; i < total; i++) {
      snows.push(generateRandomSnow());
    }
    requestAnimationFrame(draw);
  }


  class Snow {
    constructor(left, top, scale, deg) {
      this.left = left;
      this.top = top;
      this.scale = scale;
      this.deg = deg;
    }
  }

  class Utils {
    static random(start, end) {
      return Math.random() * (end-start) + start;
    }

    static radian(deg) {
      return deg * Math.PI / 180;
    }

    static isInViewport(snow = new Snow()) {
      return (
        snow.top >= 0 &&
        snow.left >= 0 &&
        snow.top <= wHeight &&
        snow.left <= wWidth
      );
    }
  }

  init();
})();

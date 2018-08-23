function map(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var Simple1DNoise = function() {
  var MAX_VERTICES = 256;
  var MAX_VERTICES_MASK = MAX_VERTICES - 1;
  var amplitude = 1;
  var scale = 1;

  var r = [];

  for (var i = 0; i < MAX_VERTICES; ++i) {
    r.push(Math.random());
  }

  var getVal = function(x) {
    var scaledX = x * scale;
    var xFloor = Math.floor(scaledX);
    var t = scaledX - xFloor;
    var tRemapSmoothstep = t * t * (3 - 2 * t);

    /// Modulo using &
    var xMin = xFloor & MAX_VERTICES_MASK;
    var xMax = (xMin + 1) & MAX_VERTICES_MASK;

    var y = lerp(r[xMin], r[xMax], tRemapSmoothstep);

    return y * amplitude;
  };

  var lerp = function(a, b, t) {
    return a * (1 - t) + b * t;
  };

  // return the API
  return {
    getVal: getVal,
    setAmplitude: function(newAmplitude) {
      amplitude = newAmplitude;
    },
    setScale: function(newScale) {
      scale = newScale;
    }
  };
};

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

const noise = new Simple1DNoise();

const colors = [
  '#3DBFE0', // Blue
  '#FA8613', // Orange
  'rgb(91, 151, 73)' // Green
];

export default class Canvas {
  constructor(container, totalCats, totalThemes, totalGenres) {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.animReq;

    container.appendChild(this.canvas);

    this.x = [];
    this.y = [];
    this._tc = totalCats;
    this._tt = totalThemes;
    this._tg = totalGenres;
    this._shapeRes = totalCats + totalThemes + totalGenres;
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
    let startRadius = 100;
    this.Xseeds = [];
    this.Yseeds = [];
    this.Xincrease = 0.01;
    this.Yincrease = 0.01;
    this.amplitude = 80;

    this.ctx.globalAlpha = .02;
    let angle = (Math.PI * 2) / this._shapeRes;

    for (let i = 0; i < this._shapeRes; i++) {
      this.Xseeds[i] = getRandomFloat(0, 10000);
      this.Yseeds[i] = getRandomFloat(0, 10000);
      this.x[i] = Math.cos(angle * i) * startRadius;
      this.y[i] = Math.sin(angle * i) * startRadius;
    }

    this.draw(this._tc, this._tt, this._tg);
  }

  draw(tc, tt, tg) {
    this.animI = 0;
    this.tc = tc;
    this.tt = tt;
    this.tg = tg;
    this.shapeRes = tc + tt + tg;

    if (this.shapeRes < 10) {
      this.ctx.globalAlpha = 1 / this.shapeRes;
    } else {
      this.ctx.globalAlpha = .02;
    }

    this.tick();
  }

  tick() {
    let c = colors[2];

    if (this.animI < this.tc) {
      c = colors[0];
    } else if (this.animI > this.tc && this.animI < this.tt) {
      c = colors[1];
    }
    this.ctx.strokeStyle = c;

    this.amplitude += map(this.centerY, 0, this.canvas.height, -10, 10);

    this.ctx.save();
    this.ctx.translate(this.centerX, this.centerY);
    this.ctx.beginPath();

    let xlength = noise.getVal(this.Xseeds[this.shapeRes - 1]) * this.amplitude * 2 - this.amplitude;
    let ylength = noise.getVal(this.Yseeds[this.shapeRes - 1]) * this.amplitude * 2 - this.amplitude;

    this.ctx.lineTo(this.x[this.shapeRes - 1] + xlength, this.y[this.shapeRes - 1] + ylength);

    for (let i = 0; i < this.shapeRes; i++) {
      xlength = noise.getVal(this.Xseeds[i]) * this.amplitude * 2 - this.amplitude;
      ylength = noise.getVal(this.Yseeds[i]) * this.amplitude * 2 - this.amplitude;
    }
    this.ctx.lineTo(this.x[this.animI] + xlength, this.y[this.animI] + ylength);
    xlength = noise.getVal(this.Xseeds[0]) * this.amplitude * 2 - this.amplitude;
    ylength = noise.getVal(this.Yseeds[0]) * this.amplitude * 2 - this.amplitude;
    this.ctx.lineTo(this.x[0] + xlength, this.y[0] + ylength);

    xlength = noise.getVal(this.Xseeds[1]) * this.amplitude * 2 - this.amplitude;
    ylength = noise.getVal(this.Yseeds[1]) * this.amplitude * 2 - this.amplitude;
    this.ctx.lineTo(this.x[1] + xlength, this.y[1] + ylength);

    this.ctx.stroke();

    this.ctx.restore();

    for (let i = 0; i < this.shapeRes; i++) {
      this.Xseeds[i] += this.Xincrease * map(this.centerX, 0, this.canvas.width, 0.75, 2.0);
      this.Yseeds[i] += this.Yincrease * map(this.centerX, 0, this.canvas.width, 0.75, 2.0);
    }

    if (this.animI < this.shapeRes) {
      this.animReq = requestAnimationFrame(this.tick.bind(this));
      this.animI++;
    } else {
      window.cancelAnimationFrame(this.animReq);
    }
  }

  reset() {
    window.cancelAnimationFrame(this.animReq);
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  drawAll() {
    this.reset();
    this.draw(this._tc, this._tt, this._tg);
  }

  drawc(num) {
    this.reset();
    this.draw(num, 0, 0);
  }

  addc(num) {
    this.reset();
    this.draw(this.tc + num, this.tt, this.tg);
  }

  drawt(num) {
    this.reset();
    this.draw(0, num, 0);
  }

  addt(num) {
    this.reset();
    this.draw(this.tc, this.tt + num, this.tg);
  }

  drawg(num) {
    this.reset();
    this.draw(0, 0, num);
  }

  addg(num) {
    this.reset();
    this.draw(this.tc, this.tt, this.tg + num);
  }
};

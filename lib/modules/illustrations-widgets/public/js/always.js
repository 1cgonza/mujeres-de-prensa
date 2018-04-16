var Area = function(ele) {
  this.ele = ele;
  this.img = this.ele.querySelector('img');

  if (this.img) {
    this.zoom = 1.3;
    this.imgItem = this.ele.querySelector('.apos-slideshow-item');
    this.parentCol = this.ele.closest('.col2');
    this.ratio = this.img.naturalHeight / this.img.naturalWidth;
    this.boxWidth = this.img.clientWidth * this.zoom;
    this.offT = this.ele.closest('.apos-area').offsetTop + this.ele.closest('.apos-area-widget-wrapper').offsetTop;
    this.ratioX = this.boxWidth / (100 * this.zoom);
    this.ratioY = this.boxWidth * this.ratio / (100 * this.zoom);

    this.ele.onmousemove = this.handleMouseMove.bind(this);
    this.ele.onmouseleave = this.handleMouseLeave.bind(this);
  }
};

Area.prototype.handleMouseMove = function(event) {
  var translatedY = getComputedTranslateY(this.parentCol) || 0;
  var x = event.pageX - this.parentCol.offsetLeft - this.ele.offsetLeft;
  var y = event.pageY - this.ele.offsetTop - translatedY - this.offT;
  var xPercent = (x / this.ratioX) + '%';
  var yPercent = (y / this.ratioY) + '%';

  Object.assign(this.imgItem.style, {
    backgroundPosition: xPercent + ' ' + yPercent,
    backgroundSize: (this.img.naturalWidth * this.zoom) + 'px'
  });
};

Area.prototype.handleMouseLeave = function(event) {
  Object.assign(this.imgItem.style, {
    backgroundPosition: 'center center',
    backgroundSize: 'contain'
  });
};

if (document.querySelector('.page-illustrations')) {
  var resizeTimer;

  function init() {
    var zoomAreas = document.querySelectorAll('.zoomImg');

    if (zoomAreas) {
      for (var i = 0; i < zoomAreas.length; i++) {
        new Area(zoomAreas[i]);
      }
    }
  }

  function getComputedTranslateY(obj) {
    if (!window.getComputedStyle) {
      return;
    }
    var style = getComputedStyle(obj);
    var transform = style.transform || style.webkitTransform || style.mozTransform;
    var mat = transform.match(/^matrix3d\((.+)\)$/);

    if (mat) {
      return parseFloat(mat[1].split(', ')[13]);
    }

    mat = transform.match(/^matrix\((.+)\)$/);
    return mat ? parseFloat(mat[1].split(', ')[5]) : 0;
  }

  function handleResize(event) {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function(event) {
      init();
    }, 250);
  }

  window.addEventListener('load', init, false);
  window.addEventListener('resize', handleResize, false);
}

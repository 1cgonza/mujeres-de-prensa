function init() {
  var zoomAreas = document.querySelectorAll('.zoomImg');
  var zoom = 1.3;

  if (zoomAreas) {
    for (var i = 0; i < zoomAreas.length; i++) {
      let zoomArea = zoomAreas[i];
      let img = zoomArea.querySelector('img');

      if (img) {
        let parentCol = zoomArea.closest('.col2');
        let ratio = img.naturalHeight / img.naturalWidth;
        let boxWidth = img.clientWidth * zoom;
        let offT = zoomArea.closest('.apos-area').offsetTop + zoomArea.closest('.apos-area-widget-wrapper').offsetTop;
        let ratioX = boxWidth / (100 * zoom);
        let ratioY = boxWidth * ratio / (100 * zoom);

        zoomArea.onmousemove = function(event) {
          var translatedY = getComputedTranslateY(parentCol) || 0;
          var x = event.pageX - parentCol.offsetLeft - this.offsetLeft;
          var y = event.pageY - this.offsetTop - translatedY - offT;
          var xPercent = (x / ratioX) + '%';
          var yPercent = (y / ratioY) + '%';

          Object.assign(this.querySelector('.apos-slideshow-item').style, {
            backgroundPosition: xPercent + ' ' + yPercent,
            backgroundSize: (img.naturalWidth * zoom) + 'px'
          });
        };

        zoomArea.onmouseleave = function(event) {
          Object.assign(this.querySelector('.apos-slideshow-item').style, {
            backgroundPosition: 'center center',
            backgroundSize: 'contain'
          });
        };
      }
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

window.addEventListener('load', init);

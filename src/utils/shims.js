export const loop = window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.msRequestAnimationFrame ||
window.oRequestAnimationFrame ||
function(callback) {
  setTimeout(callback, 1000 / 60);
};

export const transformProp = window.transformProp || (() => {
  var testEl = document.createElement('div');
  if (testEl.style.transform === null) {
    var vendors = ['Webkit', 'Moz', 'ms'];
    for (var vendor in vendors) {
      if (testEl.style[vendors[vendor] + 'Transform'] !== undefined) {
        return vendors[vendor] + 'Transform';
      }
    }
  }
  return 'transform';
})();

export const shims = (() => {
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function(callback, thisArg) {
      thisArg = thisArg || window;
      for (var i = 0; i < this.length; i++) {
        callback.call(thisArg, this[i], i, this);
      }
    };
  }
})();

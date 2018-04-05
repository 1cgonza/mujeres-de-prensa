
import { shims, loop, transformProp } from './utils/shims';
import Menu from './components/Menu';

let menu = new Menu();

var parallaxContainer = document.querySelector('.parallax');

if (parallaxContainer) {
  var sections = document.querySelectorAll('section');
  var data = [];
  var oldY = 0;
  var ticking = false;
  var stageH = 0;
  var innerGrids = document.querySelectorAll('.columns');
  var innerGridsData = [];
  var fixedCols = [];

  if (sections) {
    sections.forEach(function(section, i) {
      section.style.zIndex = sections.length - i;
    });
  }

  if (innerGrids) {
    innerGrids.forEach(function(grid, i) {
      var fixedCol = grid.querySelector('.fixedCol');
      innerGridsData[i] = {
        top: grid.offsetTop,
        height: grid.offsetHeight
      };

      // if section is inside an area, get offset top from the parent
      if (grid.closest('.apos-area') && grid.closest('.apos-area-widget-wrapper')) {
        innerGridsData[i].top = grid.closest('.apos-area').offsetTop + grid.closest('.apos-area-widget-wrapper').offsetTop;
      }

      if (fixedCol) {
        fixedCols[i] = fixedCol;
      } else {
        console.error('No .fixedCol class found for', grid, ' - Check HTML.');
      }
    });
  }

  function setup() {
    // for (var i = 0; i < sections.length; i++) {
    //   data[i] = {
    //     top: sections[i].offsetTop,
    //     height: sections[i].offsetHeight
    //   };

    //   sections[i].style[transformProp] = 'translateY(-' + data[i].top + 'px)';

    //   if (window.scrollY > 0 && window.scrollY < data[i].top) {
    //     sections[i].style[transformProp] = 'translateY(' + (window.scrollY - data[i].top) + 'px)';
    //     oldY = window.scrollY;
    //   }
    // }

    stageH = window.innerHeight;
  }

  function onScroll() {
    oldY = window.scrollY;
    requestTick();
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  function update() {
    var newY = oldY;

    // sections.forEach(function(section, i) {
    //   var d = data[i];

    //   if (newY < d.top) {
    //     section.style[transformProp] = 'translateY(' + (newY - d.top) + 'px)';
    //   }
    // });

    innerGrids.forEach(function(grid, i) {
      var fixed = fixedCols[i];
      var d = innerGridsData[i];
      var fixedH = fixed.offsetHeight;
      var limit = d.top + d.height - fixedH;

      if (fixed) {
        if (newY >= d.top && newY < limit) {
          fixed.style[transformProp] = 'translateY(' + (newY - d.top) + 'px)';
        } else if (newY >= limit) {
          fixed.style[transformProp] = 'translateY(' + (d.height - fixedH) + 'px)';
        } else {
          fixed.style[transformProp] = 'translateY(0px)';
        }
      }

    });

    ticking = false;
  }

  setup();
  window.addEventListener('scroll', onScroll, false);
  window.addEventListener('resize', setup, false);
}

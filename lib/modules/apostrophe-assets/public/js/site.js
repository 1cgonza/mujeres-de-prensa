$(function() {
  var loop = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    function(callback) {
      setTimeout(callback, 1000 / 60);
    };

  var transformProp = window.transformProp || (function() {
    var testEl = document.createElement('div');
    if (testEl.style.transform === null) {
      var vendors = ['Webkit', 'Moz', 'ms'];
      for (var vendor in vendors) {
        if (testEl.style[ vendors[vendor] + 'Transform' ] !== undefined) {
          return vendors[vendor] + 'Transform';
        }
      }
    }
    return 'transform';
  })();

  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function(callback, thisArg) {
      thisArg = thisArg || window;
      for (var i = 0; i < this.length; i++) {
        callback.call(thisArg, this[i], i, this);
      }
    };
  }

  // Menu
  var menu = document.getElementById('siteMenu');
  var menuBtn = document.getElementById('siteMenuIcon');
  var blackOut = document.getElementById('blackout');
  var menuPageLinks = document.querySelectorAll('.pageLink');
  menuBtn.addEventListener('click', onMenuClick, false);

  menuPageLinks.forEach(function(link) {
    if (link.classList.contains('current')) {
      link.style.color = link.dataset.color;
      link.style.pointerEvents = 'none';
    } else {
      link.onmouseover = function() {
        this.style.color = this.dataset.color;
      };

      link.onmouseout = function() {
        this.style.color = 'initial';
      };
    }
  });

  function onMenuClick(e) {
    menu.classList.toggle('active');

    if (menu.classList.contains('active')) {
      blackOut.classList.remove('hidden');
      hideOnClickOutside(menu);
    } else {
      blackOut.classList.add('hidden');
    }
  }

  function hideOnClickOutside(element) {
    var outsideClickListener = function(event) {
      if (event.target !== menuBtn) {
        if (!element.contains(event.target)) {
          menu.classList.remove('active');
          blackOut.classList.add('hidden');
          removeClickListener();
        }
      }
    };

    var removeClickListener = function() {
      document.removeEventListener('click', outsideClickListener);
    };
    document.addEventListener('click', outsideClickListener);
  }

  /*================================
  =            Parallax            =
  ================================*/
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
            fixed.style.transform = 'translateY(' + (newY - d.top) + 'px)';
          } else if (newY >= limit) {
            fixed.style.transform = 'translateY(' + (d.height - fixedH) + 'px)';
          } else {
            fixed.style.transform = 'translateY(0px)';
          }
        }

      });

      ticking = false;
    }

    setup();
    window.addEventListener('scroll', onScroll, false);
    window.addEventListener('resize', setup, false);
  }

});

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
  /*================================
  =            Parallax            =
  ================================*/
  var parallaxContainer = document.querySelector('.parallax');

  if (parallaxContainer) {
    var sections = document.querySelectorAll('section');
    var offsets  = [];
    var oldY = 0;
    var ticking = false;
    var stageH = 0;

    if (sections) {
      sections.forEach(function(section, i) {
        section.style.zIndex = i + 1;
      });
    }

    function setup() {
      for (var i = 0; i < sections.length; i++) {
        offsets[i] = sections[i].offsetTop;
      }

      stageH = window.innerHeight;
    }

    var landing = document.querySelector('.landingSection');
    var innerGrids = document.querySelectorAll('.columns');
    var landingEnd = 0;

    if (landing) {
      landingEnd = landing.offsetHeight;
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

      if (landingEnd > 0 && newY < landingEnd) {
        landing.style.transform = 'translate(0, ' + (newY / 2) + 'px)';
      }

      for (var n = 0; n < sections.length; n++) {
        if (newY >= offsets[n] && newY <= offsets[n + 1]) {
          var current = sections[n];
          var currentOff = offsets[n];

          if (newY > currentOff + current.offsetHeight - stageH) {
            console.log('hold', current);
            current.style.transform = 'translateY(' + (newY - currentOff) + 'px)';
          }

        }
      }

      for (var i = 0; i < innerGrids.length; i++) {
        var innerGrid = innerGrids[i];
        var columns = innerGrid.querySelectorAll('.gridCol');
        var fixed = innerGrid.querySelector('.fixedCol');

        if (fixed && newY >= innerGrid.offsetTop && newY < (innerGrid.offsetTop + innerGrid.offsetHeight - fixed.offsetHeight)) {
          fixed.style.transform = 'translateY(' + (newY - innerGrid.offsetTop) + 'px)';
        }
      }

      ticking = false;
    }
 
    setup();
    window.addEventListener('scroll', onScroll, false);
    window.addEventListener('resize', setup, false);
  }

});

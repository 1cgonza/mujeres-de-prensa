import { shims, loop, transformProp } from './utils/shims';
import Menu from './components/Menu';
import Parallax from './components/Parallax';
import Timeline from './components/Timeline';
import Gallery from './components/Gallery';
import Globe from './components/Globe';
import Connections from './components/Connections';

let resizeTimer;
let menu = new Menu(document.getElementById('siteMenu'));
let parallax = new Parallax(document.querySelector('.parallax'));
let bodyClasses = document.body.classList;
let galleryContainer = document.querySelector('.gallery');

if (bodyClasses.contains('pageTimeline')) {
  new Timeline(document.getElementById('timelineContainer'));
}

if (galleryContainer) {
  new Gallery('.gallery');
}

if (bodyClasses.contains('ic_all')) {
  new Connections(document.getElementById('stage'));
} else if (bodyClasses.contains('ic_places')) {
  new Globe(document.getElementById('stage'));
}

function onResize(event) {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    parallax.reset();
  }, 250);
}

function hidePreloader(event) {
  var preloader = document.getElementById('preloaderWrapper');

  if (preloader) {
    preloader.classList.add('hidden');
  }
}

window.addEventListener('load', hidePreloader, false);
window.addEventListener('resize', onResize, false);

// Also hide when the main content is refreshed via ajax
jQuery(document).ajaxComplete(function() {
  hidePreloader();
});

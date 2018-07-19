import Menu from './components/Menu';
import Parallax from './components/Parallax';
import Timeline from './components/Timeline';
import Gallery from './components/Gallery';

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

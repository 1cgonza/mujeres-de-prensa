import { shims, loop, transformProp } from './utils/shims';
import Menu from './components/Menu';
import Parallax from './components/Parallax';
import req from './utils/req';

let resizeTimer;
let menu = new Menu(document.getElementById('siteMenu'));
let parallax = new Parallax(document.querySelector('.parallax'));

if (document.body.classList.contains('ic')) {
  let stage = document.getElementById('stage');

  req('/assets/data/Mireya-temas.json').then(data => {
    console.log(data);
  }).catch(err => {
    throw new Error(err);
  });
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

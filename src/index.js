import { shims, loop, transformProp } from './utils/shims';
import Menu from './components/Menu';
import Parallax from './components/Parallax';
import Timeline from './components/Timeline';
import req from './utils/req';
import {months} from './utils/months';
import svg from 'svg.js';
import slug from 'slugg';

let resizeTimer;
let menu = new Menu(document.getElementById('siteMenu'));
let parallax = new Parallax(document.querySelector('.parallax'));
let bodyClasses = document.body.classList;

if (bodyClasses.contains('pageTimeline')) {
  new Timeline(document.getElementById('timelineContainer'));
}

if (bodyClasses.contains('ic')) {
  let stage = document.getElementById('stage');
  let pad = 140;
  let stageW = window.innerWidth - pad;
  let stageH = window.innerHeight - pad;
  let categories = [];
  let themes = [];
  let genres = [];
  let yearStart = 99999;
  let yearEnd = 0;
  let timeRange = 0;
  let stepW = 0;
  let numEditions = 0;
  let svg = SVG('stage').size(stageW, stageH);
  let nodeSize = 5;

  req('/assets/data/Mireya-temas.json').then(data => {
    let db = Object.keys(data).sort((a, b) => {
      let edA = Array.isArray(data[a][0].ed) ? data[a][0].ed[0] : data[a][0].ed;
      let edB = Array.isArray(data[b][0].ed) ? data[b][0].ed[0] : data[b][0].ed;
      return edA - edB;
    });

    db.forEach(edKey => {
      data[edKey].forEach(article => {
        if (article.hasOwnProperty('category')) {
          article.category.forEach(category => {
            let name = slug(category);

            if (categories.indexOf(name) < 0) {
              categories.push(name);
            }
          });
        }

        if (article.hasOwnProperty('genres')) {
          article.genres.forEach(genre => {
            let name = slug(genre);

            if (genres.indexOf(name) < 0) {
              genres.push(name);
            }
          });
        }

        if (article.hasOwnProperty('theme')) {
          let name = slug(article.theme);

          if (themes.indexOf(name) < 0) {
            themes.push(slug(name));
          }
        }

        if (Array.isArray(article.ed)) {
          numEditions = article.ed[article.ed.length - 1] > numEditions ? article.ed[article.ed.length - 1] : numEditions;
        } else {
          numEditions = article.ed > numEditions ? article.ed : numEditions;
        }

        yearStart = article.year < yearStart ? article.year : yearStart;
        yearEnd = article.year > yearEnd ? article.year : yearEnd;
      });
    });

    let blocksW = stageW / numEditions;
    let margin = blocksW / 4;
    let stepW = blocksW - margin;
    let blockH = stageH - 50;
    let categoryRels = {};
    let genresRels = {};
    let themesRels = {};
    timeRange = (yearEnd - yearStart) + 1;

    db.forEach(edKey => {
      let collection = data[edKey];
      let ed = Array.isArray(collection[0].ed) ? collection[0].ed[0] - 1 : collection[0].ed - 1;
      let _stepW = Array.isArray(collection[0].ed) ? stepW * collection[0].ed.length : stepW;
      let articleStep = blockH / collection.length;
      let box = svg.group().x(blocksW * ed);

      box.text(edKey).center(_stepW / 2, 20);
      box.rect(_stepW, blockH).attr({
        fill: 'transparent',
        'stroke-width': 1
      }).y(49);

      collection.forEach((article, i) => {
        let ed = Array.isArray(article.ed) ? article.ed[0] - 1 : article.ed - 1;
        let y = (i * articleStep);
        let node = box.circle(nodeSize).fill('#000').move((_stepW / 2) - 2, y + 50);

        if (article.hasOwnProperty('category')) {
          article.category.forEach(cat => {
            let name = slug(cat);

            if (!categoryRels.hasOwnProperty(name)) {
              categoryRels[name] = {
                nodes: [],
                rels: []
              };
            }

            categoryRels[name].nodes.push(node);

            //if ()
          });
          //attributes['data-categories'] = article.category.map(cat => slug(cat)).join(' ');
        }

        if (article.hasOwnProperty('genres')) {
          article.genres.forEach(genre => {
            let name = slug(genre);

            if (!genresRels.hasOwnProperty(name)) {
              genresRels[name] = [];
            }

            genresRels[name].push(node);
          });
          //attributes['data-genres'] = article.genres.map(genre => slug(genre)).join(' ');
        }

        if (article.hasOwnProperty('theme')) {
          let name = slug(article.theme);

          if (!themesRels.hasOwnProperty(name)) {
            themesRels = [];
          }

          themesRels.push(node);
          //attributes['data-theme'] = slug(article.theme);
        }

        node.mouseover(function() {
          this.animate(200, '<>').attr({
            fill: '#f03'
          }).size(50);
        });

        node.mouseout(function() {
          this.animate(100, '<>').attr({
            fill: '#000'
          }).size(nodeSize);
        });

      });
    });
    console.log(categoryRels);

    Object.keys(categoryRels).forEach(category => {
      categoryRels[category].nodes.forEach((node, i) => {
        if (i < category.length - 1) {
          let parent = node.parent();
          // let x1 = node.node.x2.baseVal.value;
          // let y1 = node.node.y2.baseVal.value;
          console.log(node)
          //parent.path(`M${x1} ${y1} C 20 20, 40 20, 50 10`);
        }
      });
    });

    console.log(categories, themes, genres, yearStart, yearEnd, yearEnd - yearStart, timeRange, stepW);
  });
}

function extractTopic(slug) {

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


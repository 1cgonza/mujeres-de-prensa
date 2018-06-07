import svg from 'svg.js';
import slug from 'slugg';
import {months} from '../../utils/months';
import req from '../../utils/req';
import {el, mount} from 'redom';

const colors = [
  '#38acc6', // Blue
  '#d79f2e', // Mustard
  '#b74ea3', // Purple
  '#c2401f', // Red
  '#fa8613', // Orange
  '#40ad81', // Green
];
const colorsL = colors.length;

const magazines = [
  {slug: 'mireya', name: 'Mireya', key: 'Mireya'},
  {slug: 'af', name: 'Agitación Femenina', key: 'AF'},
  {slug: 'mf', name: 'Mundo Femenino', key: 'MF'},
  {slug: 'verdad', name: 'Verdad', key: 'Verdad'},
  {slug: 'contrastes', name: 'Constrastes', key: 'Contrastes'},
  {slug: 'mujer', name: 'Mujer', key: 'Mujer'}
];

function random(min, max, isFloat) {
  var val = Math.floor(Math.random() * (max - min)) + min;

  if (isFloat) {
    val = Math.random() * (max - min) + min;
  }

  return val;
};

export default class Connections {
  constructor(container) {
    if (!container) {
      return false;
    }
    let pad = 140;
    let stageW = window.innerWidth;
    let stageH = window.innerHeight;
    let categories = [];
    let themes = [];
    let genres = [];
    let yearStart = 99999;
    let yearEnd = 0;
    let timeRange = 0;
    let stepW = 0;
    let numEditions = 0;
    let nodeSize = 5;

    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = 'taxRels';
    svg.setAttribute('viewBox', `0 0 ${stageW} ${stageH}`);
    svg.setAttribute('width', stageW);
    svg.setAttribute('height', stageH);
    svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');
    container.appendChild(svg);

    container.classList.add('gridWrapper');

    req('/assets/db/Mireya-temas.json').then(data => {
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
      console.log(db, data);
      db.forEach(edKey => {
        let collection = data[edKey];
        let ed = Array.isArray(collection[0].ed) ? collection[0].ed[0] - 1 : collection[0].ed - 1;
        let _stepW = Array.isArray(collection[0].ed) ? `w${collection[0].ed.length}` : 'w1';
        let articleStep = blockH / collection.length;
        let box = document.createElement('div');
        box.className = `book ${_stepW}`;

        let info = document.createElement('div');
        let title = document.createElement('p');
        let date = document.createElement('p');
        info.className = 'info';
        title.className = 'title';
        title.innerText = `No. ${Array.isArray(collection[0].ed) ? collection[0].ed.join(' & ') : collection[0].ed}`;
        date.className = 'date';
        date.innerText = `${collection[0].month.join(', ')}, ${collection[0].year.toString().slice(2, 4)}`;

        info.appendChild(title);
        info.appendChild(date);
        box.appendChild(info);
        container.appendChild(box);

        collection.forEach((article, i) => {
          let ed = Array.isArray(article.ed) ? article.ed[0] - 1 : article.ed - 1;
          let y = (i * articleStep);
          let node = document.createElement('span');
          box.appendChild(node);

          node.dataset.title = article.title;

          if (article.hasOwnProperty('category')) {
            article.category.forEach(cat => {
              let name = slug(cat);
              node.classList.add(`cat-${name}`);
            });
          }

          if (article.hasOwnProperty('genres')) {
            article.genres.forEach(genre => {
              let name = slug(genre);
              node.classList.add(`gen-${name}`);
            });
          }

          if (article.hasOwnProperty('theme')) {
            let name = slug(article.theme);
            node.classList.add(`the-${name}`);
          }

          node.onmouseenter = () => {
            let list = node.classList;
            let x1 = node.offsetLeft + 8;
            let y1 = node.offsetTop + 8;

            for (let i = 0; i < list.length; i++) {
              let key = list[i];
              let matches = container.querySelectorAll(`.${key}`);

              for (let j = 0; j < matches.length; j++) {
                let target = matches[j];
                let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                let x2 = target.offsetLeft + 8;
                let y2 = target.offsetTop + 8;
                let c1y = y1 > y2 ? (y2 - y1) / 2 : (y1 - y2) / 2;
                let c1x = x1 < x2 ? (x2 - x1) / 2 : (x1 + (x1 - x2) / 2);
                path.setAttributeNS(null, 'd', `M${x1} ${y1} C ${c1x} ${y1}, ${c1x} ${y2}, ${x2} ${y2}`);
                path.setAttributeNS(null, 'stroke', colors[random(0, colorsL)]);
                path.setAttributeNS(null, 'fill', 'transparent');
                svg.appendChild(path);
              }
            }
          };

          node.onmouseleave = () => {
            svg.innerHTML = '';
          };
        });
      });
    });
  }
}

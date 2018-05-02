import svg from 'svg.js';
import slug from 'slugg';
import { months } from '../../utils/months';
import req from '../../utils/req';

export default class Connections {
  constructor(container) {
    if (!container) {
      return false;
    }
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

    Object.assign(container.style, {
      'background-color': '#382e2e',
      width: window.innerWidth + 'px',
      height: window.innerHeight + 'px'
    });

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

      db.forEach(edKey => {
        let collection = data[edKey];
        let ed = Array.isArray(collection[0].ed) ? collection[0].ed[0] - 1 : collection[0].ed - 1;
        let _stepW = Array.isArray(collection[0].ed) ? stepW * collection[0].ed.length : stepW;
        let articleStep = blockH / collection.length;
        let box = svg.group().x(blocksW * ed);

        let edTitle = 'No. ';
        edTitle += Array.isArray(collection[0].ed) ? collection[0].ed.join(' & ') : collection[0].ed;
        box.text(edTitle).font({
          family: 'Lato',
          size: 12,
          fill: '#fff'
        }).center(_stepW / 2, 20);
        box.rect(_stepW, blockH).attr({
          fill: '#fff'
        }).y(49);

        collection.forEach((article, i) => {
          let ed = Array.isArray(article.ed) ? article.ed[0] - 1 : article.ed - 1;
          let y = (i * articleStep);
          //let node = box.circle(nodeSize).fill('#000').move((_stepW / 2) - 2, y + 50);
          let node = box.group();
          node.path('M9.4,1.5C9,1.3,8.7,1.5,8.5,1.7C8.6,1.5,8.6,1.2,8.4,1C8.1,0.7,8,0.4,7.9,0C7.9,0.4,7.7,0.7,7.5,1 C7.3,1.2,7.2,1.5,7.4,1.8c0-0.1-0.3-0.4-0.9-0.3C6.1,1.6,5.7,1.8,5.6,2.2c0,0,0.7-0.3,1,0.1s0.6,1.2,1.3,0.5 C8.6,3.5,9,2.7,9.2,2.3c0.3-0.3,1-0.1,1-0.1C10.1,1.8,9.7,1.6,9.4,1.5z');
          node.path('M1.5,6.5c-0.1,0.3,0,0.7,0.3,0.9C1.5,7.2,1.2,7.3,1,7.5C0.7,7.7,0.4,7.9,0,7.9C0.4,8,0.7,8.1,1,8.4 c0.2,0.2,0.5,0.2,0.8,0.1c-0.1,0-0.4,0.3-0.3,0.9c0.1,0.4,0.4,0.7,0.8,0.8c0,0-0.3-0.7,0.1-1s1.2-0.6,0.5-1.3 c0.6-0.7-0.2-1.1-0.5-1.3s-0.1-1-0.1-1C1.8,5.8,1.6,6.1,1.5,6.5z');
          node.path('M6.5,14.4c0.3,0.1,0.7,0,0.9-0.3c-0.1,0.2-0.1,0.5,0.1,0.7c0.2,0.3,0.4,0.6,0.5,1c0.1-0.4,0.2-0.7,0.4-1 c0.2-0.2,0.2-0.5,0.1-0.8c0,0.1,0.3,0.4,0.9,0.3c0.4-0.1,0.7-0.4,0.8-0.8c0,0-0.7,0.3-1-0.1C9,13.1,8.6,12.3,7.9,13 c-0.7-0.6-1.1,0.2-1.3,0.5c-0.3,0.3-1,0.1-1,0.1C5.8,14,6.1,14.3,6.5,14.4z');
          node.path('M14.4,9.4c0.1-0.3,0-0.7-0.3-0.9c0.2,0.1,0.5,0.1,0.7-0.1c0.3-0.2,0.6-0.4,1-0.4c-0.4-0.1-0.7-0.2-1-0.4 c-0.2-0.2-0.5-0.2-0.8-0.1c0.1,0,0.4-0.3,0.3-0.9c-0.1-0.4-0.4-0.7-0.8-0.8c0,0,0.3,0.7-0.1,1c-0.4,0.2-1.2,0.6-0.5,1.3 c-0.6,0.7,0.2,1.1,0.5,1.3c0.4,0.3,0.1,1,0.1,1C14,10.1,14.3,9.8,14.4,9.4z');
          node.path('M13.1,2.8C12.6,3.4,11,2.9,11,2.9l-0.2,0.2c0.4,1.5-0.9,2.8-0.9,2.8s1.3-1.3,2.8-0.9l0.2-0.2C12.9,4.9,12.4,3.2,13.1,2.8z');
          node.path('M2.8,2.8c0.6,0.4,0.2,2.1,0.2,2.1L3.2,5c1.5-0.4,2.8,0.9,2.8,0.9S4.7,4.7,5,3.2L4.9,2.9C4.9,2.9,3.2,3.4,2.8,2.8z');
          node.path('M2.8,13.1c0.5-0.6,2.1-0.2,2.1-0.2L5,12.7c-0.4-1.5,0.9-2.8,0.9-2.8s-1.3,1.3-2.8,0.9L2.9,11C2.9,11,3.4,12.6,2.8,13.1z');
          node.path('M13.1,13.1c-0.6-0.5-0.2-2.1-0.2-2.1l-0.2-0.2c-1.5,0.4-2.8-0.9-2.8-0.9s1.3,1.3,0.9,2.8l0.2,0.2 C11,12.9,12.6,12.4,13.1,13.1z');
          node.path('M6.7,7.9c0,0.7,0.5,1.2,1.2,1.2c0.7,0,1.2-0.5,1.2-1.2c0-0.7-0.5-1.2-1.2-1.2S6.7,7.2,6.7,7.9C6.7,7.9,6.7,7.9,6.7,7.9z');
          node.move((_stepW / 2) - 8, y + 55).attr({
            'stroke-width': '5px',
            stroke: 'transparent',
            fill: '#7A3B6E'
          });

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
              fill: '#000'
            });
          });

          node.mouseout(function() {
            this.animate(100, '<>').attr({
              fill: '#7A3B6E'
            });
          });

        });
      });

      Object.keys(categoryRels).forEach(category => {
        categoryRels[category].nodes.forEach((node, i) => {
          if (i < category.length - 1) {
            let parent = node.parent();
            // let x1 = node.node.x2.baseVal.value;
            // let y1 = node.node.y2.baseVal.value;
            //console.log(node);
            //parent.path(`M${x1} ${y1} C 20 20, 40 20, 50 10`);
          }
        });
      });
    });

  }
}

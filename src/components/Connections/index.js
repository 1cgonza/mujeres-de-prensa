import slug from 'slugg';
import req from '../../utils/req';
import Canvas from './Canvas';

const magazines = [
  {slug: 'mireya', name: 'Mireya', key: 'Mireya'},
  {slug: 'af', name: 'Agitación Femenina', key: 'AF'},
  {slug: 'mf', name: 'Mundo Femenino', key: 'MF'},
  {slug: 'verdad', name: 'Verdad', key: 'Verdad'},
  {slug: 'contrastes', name: 'Constrastes', key: 'Contrastes'},
  {slug: 'mujer', name: 'Mujer', key: 'Mujer'}
];

export default class Connections {
  constructor(container) {
    if (!container) {
      return false;
    }

    this.container = container;
    this.categories = [];
    this.themes = [];
    this.genres = [];
    this.totalArticles = 0;
    this.totalCats = 0;
    this.totalThemes = 0;
    this.totalGenres = 0;
    this.activeElements = 0;
    this.hovering = false;

    this.getData().then(() => {
      this.stage = document.createElement('div');
      this.content = document.createElement('div');
      this.contentTitle = document.createElement('h2');
      this.contentSubTitle = document.createElement('h3');
      this.contentText = document.createElement('p');
      this.stage.className = 'vizContainer m-all t-80 d-80 ld-85';
      this.content.className = 'vizContent absoluteCenter';
      this.contentTitle.className = 'contentTitle';
      this.contentSubTitle.className = 'contentSubtitle';
      this.contentText.className = 'contentText';
      this.content.appendChild(this.contentTitle);
      this.content.appendChild(this.contentSubTitle);
      this.content.appendChild(this.contentText);
      this.container.appendChild(this.content);
      this.container.appendChild(this.stage);

      for (let mag in this.data) {
        let d = this.data[mag];
        let magContainer = document.createElement('div');
        let magTitle = document.createElement('h2');
        let magI = magazines.findIndex(obj => obj.key === mag);
        magTitle.innerText = magazines[magI].name;
        magTitle.className = 'magTitle';

        magContainer.className = 'magContainer';
        magContainer.appendChild(magTitle);
        this.stage.appendChild(magContainer);

        let db = Object.keys(d).sort((a, b) => {
          let edA = Array.isArray(d[a][0].ed) ? d[a][0].ed[0] : d[a][0].ed;
          let edB = Array.isArray(d[b][0].ed) ? d[b][0].ed[0] : d[b][0].ed;
          return edA - edB;
        });

        db.forEach(ed => {
          let edContainer = document.createElement('div');
          let edBtn = document.createElement('span');
          edBtn.className = 'ed';
          edContainer.className = `edContainer ${ed}`;
          edContainer.appendChild(edBtn);
          magContainer.appendChild(edContainer);

          let firstChild = this.data[mag][ed][0];
          edBtn.onmouseenter = () => {
            this.renderContent(`${magazines[magI].name}, ${ed}`, `${firstChild.month.join(', ')} - ${firstChild.year}`);
          };

          edBtn.onmouseleave = () => {
            this.clearContent();
          };

          this.data[mag][ed].forEach(article => {
            this.totalArticles++;
            let point = document.createElement('span');
            point.className = `node`;

            if (article.category) {
              article.category.forEach(cat => point.classList.add(`c-${slug(cat)}`));
              this.totalCats += article.category.length;
            }

            if (article.genres) {
              article.genres.forEach(cat => point.classList.add(`g-${slug(cat)}`));
              this.totalGenres += article.genres.length;
            }

            if (article.theme) {
              point.classList.add(`t-${slug(article.theme)}`);
              this.totalThemes++;
            }

            let subTitle = `${magazines[magI].name}, ed.${article.ed}, ${article.month.join(', ')}, ${article.year}`;
            let text = article.hasOwnProperty('category') ? `Categorías: ${article.category.join(', ')}\n` : '';
            text += article.hasOwnProperty('theme') ? `Temas: ${article.theme}\n` : '';
            text += article.hasOwnProperty('genres') ? `Géneros: ${article.genres.join(', ')}\n` : '';
            text += article.hasOwnProperty('pages') ? `pg: ${article.pages.join(', ')}\n` : '';

            point.onmouseenter = () => {
              this.renderContent(article.title, subTitle, text);
            };

            point.onmouseleave = () => {
              this.clearContent();
            };

            edContainer.appendChild(point);
          });
        });
      }

      this.buildMenu('m-100 t-20 d-20 ld-15');
      this.canvas = new Canvas(this.container, this.totalCats, this.totalThemes, this.totalGenres);
    });
  }

  renderContent(title, subtitle, text) {
    if (title) {
      this.contentTitle.innerText = title;
    }

    if (subtitle) {
      this.contentSubTitle.innerText = subtitle;
    }

    if (text) {
      this.contentText.innerText = text;
    }
  }

  clearContent() {
    this.contentTitle.innerText = '';
    this.contentSubTitle.innerText = '';
    this.contentText.innerText = '';
  }

  buildMenu(grid) {
    this._counter = 0;
    this.menu = document.createElement('div');
    this.menu.className = `menu ${grid}`;
    this.container.appendChild(this.menu);
    this.buildMenuSection(this.categories, 'Categorias', 'c');
    this.buildMenuSection(this.themes, 'Temas', 't');
    this.buildMenuSection(this.genres, 'Géneros', 'g');
  }

  buildMenuSection(arr, name, key) {
    let container = document.createElement('div');
    let title = document.createElement('h3');
    container.className = 'menuSection';
    title.className = 'menuSectionTitle';
    title.innerText = name;

    container.appendChild(title);

    arr.forEach(names => {
      this._counter++;
      let ele = document.createElement('p');
      ele.className = 'menuEle';
      ele.innerText = `(${this._counter}) ${names[1]}`;
      ele.dataset.target = names[0];
      ele.dataset.id = this._counter;

      container.appendChild(ele);
      let rels = this.stage.querySelectorAll(`.${key}-${names[0]}`);
      let relsLen = rels.length;
      let animReq;
      let classSearch = `active-${key}`;

      ele.onmouseenter = () => {
        this.hovering = true;

        if (this.activeElements > 0) {
          this.canvas[`add${key}`](relsLen);
        } else {
          this.canvas[`draw${key}`](relsLen);
        }

        let i = 0;

        function loop() {
          if (i < relsLen) {
            if (relsLen - i >= 5) {
              rels[i++].classList.add(classSearch);
              rels[i++].classList.add(classSearch);
              rels[i++].classList.add(classSearch);
              rels[i++].classList.add(classSearch);
              rels[i++].classList.add(classSearch);
            } else {
              for (let j = i; j < relsLen; j++) {
                rels[j].classList.add(classSearch);
                i++;
              }
            }
            animReq = requestAnimationFrame(loop);
          } else {
            window.cancelAnimationFrame(animReq);
          }
        }
        loop();
      };

      ele.onmouseleave = () => {
        this.hovering = false;
        window.cancelAnimationFrame(animReq);
        rels.forEach(node => {
          node.classList.remove(classSearch);
        });

        if (this.activeElements === 0) {
          setTimeout(() => {
            if (!this.hovering) {
              this.canvas.drawAll();
            }            
          }, 200);
        }
      };

      ele.onclick = () => {
        if (ele.classList.contains('active')) {
          this.activeElements--;
          ele.classList.remove('active');
          rels.forEach(node => {
            node.classList.remove(`hold-${classSearch}`);
          });
        } else {
          this.activeElements++;
          ele.classList.add('active');
          rels.forEach(node => {
            node.classList.add(`hold-${classSearch}`);
          });
        }
      };
    });

    this.menu.appendChild(container);
  }

  getData() {
    return new Promise((resolve) => {
      req('/assets/db/temas.json').then(data => {
        this.data = data;

        for (let mag in data) {
          let d = data[mag];
          let db = Object.keys(d).sort((a, b) => {
            let edA = Array.isArray(d[a][0].ed) ? d[a][0].ed[0] : d[a][0].ed;
            let edB = Array.isArray(d[b][0].ed) ? d[b][0].ed[0] : d[b][0].ed;
            return edA - edB;
          });

          db.forEach(edKey => {
            d[edKey].forEach(article => {
              if (article.hasOwnProperty('category')) {
                article.category.forEach(category => {
                  if (this.categories.findIndex(arr => arr[1] === category) < 0) {
                    this.categories.push([slug(category), category]);
                  }
                });
              }

              if (article.hasOwnProperty('genres')) {
                article.genres.forEach(genre => {
                  if (this.genres.findIndex(arr => arr[1] === genre) < 0) {
                    this.genres.push([slug(genre), genre]);
                  }
                });
              }

              if (article.hasOwnProperty('theme')) {
                if (this.themes.findIndex(arr => arr[1] === article.theme) < 0) {
                  this.themes.push([slug(article.theme), article.theme]);
                }
              }
            });
          });
        }

        this.categories.sort((a, b) => a[0] > b[0] ? 1 : -1);
        this.genres.sort((a, b) => a[0] > b[0] ? 1 : -1);
        this.themes.sort((a, b) => a[0] > b[0] ? 1 : -1);

        resolve();
      });
    });
  }
}

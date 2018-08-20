import Base from './TimelineBase';
import {debounce} from '../utils/shims';

let types = {
  vidaObra: {
    name: 'Vida y Obra',
    events: []
  },
  publicacion: {
    name: 'Publicación',
    events: []
  },
  periodoPub: {
    name: 'Período de Publicación',
    events: []
  },
  hito: {
    name: 'Hito',
    events: []
  },
  periodoHis: {
    name: 'Período histórico',
    events: []
  }
};

export default class Timeline extends Base {
  constructor(container) {
    super(container);

    if (!container) {
      return;
    }
    this.container = container;
    this.events = container.querySelectorAll('.timelineEvent');
    this.yearsContainer = document.getElementById('timelineYears');
    this.eventContainer = document.getElementById('timelineEvents');
    this.content = document.getElementById('content');
    this.blackout = document.getElementById('contentBlackout');
    this.parse();
    this.years.sort();
    this.yearEnd = 0;
    this._hovering = false;

    this.data.sort((a, b) => {
      return a.yearInit - b.yearInit;
    });

    this.data.forEach(event => {
      if (event.hasOwnProperty('yearInit') && this.yearEnd < event.yearInit) {
        this.yearEnd = event.yearInit;
      }
    });

    this.yearStart = this.years[0];

    let i = this.yearStart - (this.yearStart % 10);
    let end = this.yearEnd - (this.yearEnd % 10) + 10;
    this.yearsStep = 100 / (end - i);
    this.hStep = 96 / this.data.length;

    for (i; i <= end; i += 10) {
      this.createYearEle(i);
    }

    this.data.forEach((event, i) => {
      if (types.hasOwnProperty(event.type)) {
        types[event.type].events.push(event);
      } else {
        console.log('no event type', event);
      }
      this.createEventEle(event, i);
    });

    let legend = document.createElement('div');
    legend.className = 'legend';

    let eventNodes = document.querySelectorAll('.eventEle');

    Object.keys(types).forEach(key => {
      let name = types[key].name;
      let legendEle = document.createElement('span');
      legendEle.className = `legendEle-${key}`;
      legendEle.innerText = name;
      legend.appendChild(legendEle);

      legendEle.onmouseenter = () => {
        this._hovering = true;
        eventNodes.forEach(event => event.classList.add('hidden'));
        document.querySelectorAll(`.${key}`).forEach(eventNode => {
          eventNode.classList.remove('hidden');
          let title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          let containerCoords = this.container.getBoundingClientRect();
          let childCoords = eventNode.getBoundingClientRect();
          let x = childCoords.x - containerCoords.x + (childCoords.width / 2);
          let y = childCoords.y - containerCoords.y - (childCoords.height / 2);

          title.textContent = eventNode.dataset.title;
          title.setAttributeNS(null, 'x', x + 5);
          title.setAttributeNS(null, 'y', y - 5);
          title.setAttributeNS(null, 'font-size', (containerCoords.height / this.data.length) - 1.5);
          this.svg.appendChild(title);

          let titleDims = title.getBBox();
          if (containerCoords.width - containerCoords.x < titleDims.width + x) {
            title.setAttributeNS(null, 'x', x - titleDims.width - 5);
          }
        });
      };

      legendEle.onmouseleave = () => {
        this._hovering = false;
        eventNodes.forEach(event => event.classList.remove('hidden'));
        this.svg.innerHTML = '';
      };
    });

    this.container.appendChild(legend);

    this.blackout.onclick = () => {
      this.content.innerText = '';
      this.blackout.classList.remove('active');
      this.content.classList.remove('display');
      this.content.classList.remove('open');
    };

    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.id = 'relatives';
    this.svg.setAttribute('width', '100%');
    this.svg.setAttribute('height', '100%');
    this.svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');
    this.container.appendChild(this.svg);

    let timeout;
    let highlights = document.querySelectorAll('.sensitiveSpot');
    let highlightsOpen = true;

    document.onmousemove = () => {
      clearTimeout(timeout);

      if (this._hovering) {
        return;
      }

      if (highlightsOpen) {
        highlights.forEach(node => node.classList.remove('open'));
        highlightsOpen = false;
      }

      timeout = setTimeout(() => {
        highlights.forEach(node => node.classList.add('open'));
        highlightsOpen = true;
      }, 2000);
    };
  }

  createYearEle(year) {
    const yearStartRouded = this.yearStart - (this.yearStart % 10);
    let ele = document.createElement('div');
    let line = document.createElement('span');
    let name = document.createElement('span');
    let x = (year - yearStartRouded) * this.yearsStep;
    ele.className = 'yearEle';
    line.className = 'line';
    name.className = 'yearName';
    name.innerText = year;
    ele.style.marginLeft = `${x}%`;
    ele.appendChild(line);
    ele.appendChild(name);
    this.yearsContainer.appendChild(ele);
  }

  createEventEle(data, i) {
    const yearStartRouded = this.yearStart - (this.yearStart % 10);
    let ele = document.createElement('div');
    let x = (data.yearInit - yearStartRouded) * this.yearsStep;
    let y = (i + 1) * this.hStep;
    data.node = ele;
    let title = document.createElement('p');
    let date = document.createElement('p');
    let text;
    let place;
    let directors;
    let periodicity;
    let distribution;
    let filiation;
    let audience;
    let type = document.createElement('p');
    let links;
    let dateEnd = data.yearEnd ? +data.yearEnd : null;

    ele.dataset.title = data.title;
    title.className = 'eventTitle';
    date.className = 'eventDate';
    type.className = 'eventType';

    let lineW;
    let line = document.createElement('span');
    line.style.left = `${x}%`;
    line.style.top = `${y}%`;
    this.eventContainer.appendChild(line);

    let img = new Image();
    img.className = 'retrato';

    // img
    if (data.img) {
      img.src = data.img;
    }

    // Title
    title.innerText = data.title;

    // Date
    if (data.dateInit || date.dateEnd) {
      let str = '';

      if (data.dateInit && data.dateEnd) {
        str = `${data.dateInit} - ${data.dateEnd}`;
      } else if (data.dateInit) {
        str = `${data.dateInit}`;
      }

      date.innerText = str;
    }

    // Text
    if (data.text) {
      text = data.text;
    }

    // Type
    if (data.type) {
      type.innerText = types[data.type].name;
    }

    // Place
    if (data.place) {
      place = this.buildContentBlock('Lugar:', data.place);
    }

    // Directors
    if (data.directors) {
      directors = this.buildContentBlock('Dirección / Edición:', data.directors);
    }

    // Periodicity
    if (data.periodicity) {
      periodicity = this.buildContentBlock('Frecuencia:', data.periodicity);
    }

    // Distribution
    if (data.distribution) {
      distribution = this.buildContentBlock('Distribución:', data.distribution);
    }

    // Filiation
    if (data.filiation) {
      filiation = this.buildContentBlock('Filiación:', data.filiation);
    }

    // Audience
    if (data.audience) {
      audience = this.buildContentBlock('Público:', data.audience);
    }

    // Links
    if (data.links) {
      links = this.buildContentBlock('Enlaces externos:', data.links, true);
    }

    if (dateEnd) {
      line.className = 'line';
      lineW = `${(dateEnd - data.yearInit) * this.yearsStep}%`;
    }

    ele.style.left = `${x}%`;
    ele.style.top = `${y}%`;

    if (data.type === 'publicacion' || data.type === 'vidaObra') {
      ele.className = `eventEle highlight ${data.type}`;
      if (data.type === 'vidaObra') {
        let pic = document.createElement('div');
        pic.className = 'pic';
        pic.appendChild(img.cloneNode());
        ele.appendChild(pic);
        ele.classList.add('sensitiveSpot');
      }
    } else if (data.type) {
      ele.className = `eventEle ${data.type}`;
    } else {
      ele.className = 'eventEle';
    }

    this.eventContainer.appendChild(ele);
    let animReq;

    ele.onmouseenter = event => {
      this._hovering = true;

      if (!this.content.classList.contains('display')) {
        const view = event.target.getBoundingClientRect();
        this.content.classList.add('open');
        this.content.appendChild(title);

        if (date) {
          this.content.appendChild(date);
        }

        if (dateEnd) {
          line.style.width = lineW;
        }

        let wrapperCoords = this.container.getBoundingClientRect();
        let coords = this.content.getBoundingClientRect();
        let top = view.y + 23;
        let left = view.x - 75;

        if (top + coords.height >= wrapperCoords.height + wrapperCoords.y) {
          top = view.y - coords.height - 30;
        }

        if (left + coords.width >= wrapperCoords.width + wrapperCoords.x) {
          left = view.x - coords.width;
        }

        this.content.style.top = `${top}px`;
        this.content.style.left = `${left}px`;

        if (ele.classList.contains('vidaObra')) {
          let path;
          let rel;
          ele.classList.add('open');

          this.content.style.top = `${view.y + 23 + 30}px`;

          if (data.title.includes('Josefina Canal')) {
            rel = this.data.findIndex(ele => ele.title.includes('Mireya'));
          } else if (data.title.includes('Ofelia Uribe')) {
            // Ofelia is related to more than one magazine
            // create another path only for her
            rel = this.data.findIndex(ele => ele.title.includes('Agitación'));
            let rel2 = this.data.findIndex(ele => ele.title.includes('Verdad'));

            if (rel2) {
              let path2 = this.buildLineRel(ele, rel2);
              animatePath(path2, path2.getTotalLength());
            }
          } else if (data.title.includes('Mercedes Triana')) {
            rel = this.data.findIndex(ele => ele.title.includes('Mireya'));
          } else if (data.title.includes('Mariaurora')) {
            rel = this.data.findIndex(ele => ele.title.includes('Mundo Femenino'));
          } else if (data.title.includes('Flor Romero')) {
            rel = this.data.findIndex(ele => ele.title.includes('Mujer'));
          }

          if (rel) {
            path = this.buildLineRel(ele, rel);
            animatePath(path, path.getTotalLength());
          }
        } else if (ele.classList.contains('publicacion')) {
          let path;
          let rel;

          if (data.title.includes('Mireya')) {
            rel = this.data.findIndex(ele => ele.title.includes('Josefina Canal'));
            let rel2 = this.data.findIndex(ele => ele.title.includes('Mercedes Triana'));

            if (rel2) {
              let path2 = this.buildLineRel(ele, rel2, true);
              animatePath(path2, path2.getTotalLength());
            }
          } else if (data.title.includes('Agitación')) {
            rel = this.data.findIndex(ele => ele.title.includes('Ofelia Uribe'));
          } else if (data.title.includes('Verdad')) {
            rel = this.data.findIndex(ele => ele.title.includes('Ofelia Uribe'));
          } else if (data.title.includes('Mundo Femenino')) {
            rel = this.data.findIndex(ele => ele.title.includes('Mariaurora'));
          } else if (data.title.includes('Mujer')) {
            rel = this.data.findIndex(ele => ele.title.includes('Flor Romero'));
          }

          if (rel) {
            path = this.buildLineRel(ele, rel, true);
            animatePath(path, path.getTotalLength());
          }
        }
      }
    };

    function animatePath(path, totalLen) {
      let length = 0;

      function tick() {
        length += 40;
        if (length < totalLen) {
          path.style.strokeDasharray = `${length} ${totalLen}`;
          animReq = requestAnimationFrame(tick);
        } else {
          path.style.strokeDasharray = `${totalLen} ${totalLen}`;
        }
      }

      tick();
    }

    ele.onmouseleave = () => {
      this._hovering = false;
      ele.classList.remove('open');

      if (!this.content.classList.contains('display')) {
        this.content.classList.remove('open');
        this.content.innerText = '';

        if (dateEnd) {
          line.style.width = 0;
        }
      }

      window.cancelAnimationFrame(animReq);
      this.svg.innerHTML = '';
    };

    ele.onclick = () => {
      this.content.innerText = '';
      this.content.classList.add('display');
      this.blackout.classList.add('active');
      this.content.appendChild(title);

      if (date) {
        this.content.appendChild(date);
      }

      if (dateEnd) {
        line.style.width = 0;
      }

      if (data.img) {
        this.content.appendChild(img);
      }

      if (text) {
        this.content.appendChild(text);
      }

      if (place) {
        this.content.appendChild(place);
      }

      if (directors) {
        this.content.appendChild(directors);
      }

      if (periodicity) {
        this.content.appendChild(periodicity);
      }

      if (distribution) {
        this.content.appendChild(distribution);
      }

      if (filiation) {
        this.content.appendChild(filiation);
      }

      if (audience) {
        this.content.appendChild(audience);
      }

      // if (type) {
      //   this.content.appendChild(type);
      // }

      if (links) {
        this.content.appendChild(links);
      }
    };
  }

  buildContentBlock(titleText, text, isHTML) {
    let wrapper = document.createElement('div');
    let title = document.createElement('span');
    let content = document.createElement('span');

    wrapper.className = 'contentBlock';
    title.className = 'contentTitle';
    title.innerText = `${titleText} `;

    if (isHTML) {
      content = text;
    } else {
      content.innerText = text;
    }

    wrapper.appendChild(title);
    wrapper.appendChild(content);

    return wrapper;
  }

  buildLineRel(parent, child, invert) {
    let flip = invert ? -1 : 1;
    let relObj = this.data[child];
    let containerCoords = this.container.getBoundingClientRect();
    let parentCoords = parent.getBoundingClientRect();
    let childCoords = relObj.node.getBoundingClientRect();
    let x1 = parentCoords.x - containerCoords.x + (parentCoords.width / 2);
    let y1 = parentCoords.y - containerCoords.y - (parentCoords.height / 2);
    let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let x2 = childCoords.x - containerCoords.x + (childCoords.width / 2);
    let y2 = childCoords.y - containerCoords.y - (childCoords.height / 2);
    let midX = (x2 + x1) * .5;
    let midY = (y2 + y1) * .5;
    let theta = Math.atan2(y2 - y1, x2 - x1) - Math.PI / 2;
    let c1x = midX - (midX / 2) * Math.cos(theta) * flip;
    let c1y = midY - (midY / 2) * Math.sin(theta) * flip;
    path.setAttributeNS(null, 'class', 'relPath');
    path.setAttributeNS(null, 'd', `M${x1} ${y1} Q ${c1x} ${c1y}, ${x2} ${y2}`);
    path.setAttributeNS(null, 'stroke', '#ab78a8');
    path.setAttributeNS(null, 'fill', 'transparent');
    path.style.strokeDasharray = `${0} ${path.getTotalLength()}`;

    let title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttributeNS(null, 'x', x2 + 5);
    title.setAttributeNS(null, 'y', y2 - 5);
    title.setAttributeNS(null, 'font-size', 14);
    title.textContent = relObj.title;

    this.svg.appendChild(title);
    this.svg.appendChild(path);

    return path;
  }
}

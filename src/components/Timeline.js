import Base from './TimelineBase';
import {transformProp} from '../utils/shims';

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
    this.data.sort((a, b) => {
      return a.yearInit - b.yearInit;
    });

    this.data.forEach(event => {
      if (event.hasOwnProperty('yearEnd') && this.yearEnd < event.yearEnd) {
        this.yearEnd = event.yearEnd;
      } else if (event.hasOwnProperty('yearInit') && this.yearEnd < event.yearInit) {
        this.yearEnd = event.yearInit;
      }
    });

    this.pad = 50;
    this.yearStart = this.years[0];

    let i = this.yearStart - (this.yearStart % 10);
    let end = this.yearEnd - (this.yearEnd % 10) + 10;
    this.yearsStep = 100 / (end - i);
    this.hStep = 90 / this.data.length;

    for (i; i <= end; i += 10) {
      this.createYearEle(i);
    }
console.log(this.data);
    this.data.forEach((event, i) => {
      this.createEventEle(event, i);
    });

    this.blackout.onclick = () => {
      this.content.innerText = '';
      this.blackout.classList.remove('active');
      this.content.classList.remove('display');
      this.content.classList.remove('open');
    };
  }

  createYearEle(year) {
    let ele = document.createElement('span');
    let x = (year - this.yearStart) * this.yearsStep;
    ele.className = 'yearEle';
    ele.innerText = year;
    x = x === 0 ? this.pad / 2 : x;
    ele.style.marginLeft = `${x}%`;
    this.yearsContainer.appendChild(ele);
  }

  createEventEle(data, i) {
    let ele = document.createElement('div');
    let x = (data.yearInit - this.yearStart) * this.yearsStep;
    let y = (i + 1) * this.hStep;

    ele.style.left = `${x}%`;
    ele.style.top = `${y}%`;
    ele.style.zIndex = this.data.length - i;

    if (data.type === 'publicacion' || data.type === 'vidaObra') {
      ele.className = `eventEle highlight ${data.type}`;
    } else if (data.type) {
      ele.className = `eventEle ${data.type}`;
    } else {
      console.log(data);
      ele.className = 'eventEle';
    }
    let title = document.createElement('p');
    let date = document.createElement('p');
    let type = document.createElement('p');
    let text;
    let links;
    let dateEnd = data.yearEnd ? +data.yearEnd : null;
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
    if (data.type === 'vidaObra') {
      if (data.title === 'Vida y obra de Josefina Canal de Reyes') {
        img.src = '/uploads/attachments/cjg6sknpr00nsow1xnmh46hko-josefinacanal.one-sixth.jpg';
      } else if (data.title ===  'Vida y obra de Ofelia Uribe de Acosta') {
        img.src = '/uploads/attachments/cjg5n4mik001j791xe9e7xp3m-ofeliasinmapa.one-sixth.png';
      } else if (data.title === 'Vida y obra de Mercedes Triana de Castillo') {
        img.src = '/uploads/attachments/cjicbojwk00gqqh1xeba8r77g-triana-triana.one-sixth.png';
      } else if (data.title === 'Vida y obra de Mariaurora Escovar') {
        img.src = '/uploads/attachments/cjg6soth000peow1x7gdljmtj-mariaaurora.one-sixth.jpg';
      } else if (data.title === 'Vida y obra de Flor Romero de Nohra') {
        img.src = '/uploads/attachments/cjg6skoe100nvow1xvd3uifpc-florromero.one-sixth.jpg';
      }
      
      
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
      let str = '';

      switch (data.type) {
        case 'periodoPub':
          str = 'Período de publicación';
          break;
        case 'hito':
          str = 'Hito';
          break;
        case 'periodoHis':
          str = 'Período histórico';
          break;
      }
      type.innerText = str;
    }

    // Links
    if (data.links) {
      links = data.links;
    }

    if (dateEnd) {
      line.className = 'line';
      lineW = `${(dateEnd - data.yearInit) * this.yearsStep}%`;
    }

    //   if (data.yearEnd) {
    //     if (data.type === 'periodoPub' || data.type === 'periodoHis') {
    //       let _w = ((data.yearEnd - data.yearInit) * this.yearsStep) | 0;
    //       w = _w < w ? w : _w;
    //       let init = document.createElement('span');
    //       let line = document.createElement('span');
    //       let end = document.createElement('span');
    //       init.className = 'init';
    //       line.className = 'line';
    //       end.className = 'end';
    //       if (_w < w) {
    //         line.style.width = `${_w}px`;
    //       } else {
    //         line.style.width = `${_w - 36}px`;
    //       }

    //       ele.appendChild(init);
    //       ele.appendChild(line);
    //       ele.appendChild(end);
    //     }
    //   }


  //   // Directors
  //   if (data.directors) {
  //     let directors = document.createElement('p');
  //     directors.innerText = `Dirección / Edición: ${data.directors}`;
  //     extra.appendChild(directors);
  //   }
  //   // Periodicity
  //   if (data.periodicity) {
  //     let periodicity = document.createElement('p');
  //     periodicity.innerText = `Frecuencia: ${data.periodicity}`;
  //     extra.appendChild(periodicity);
  //   }
  //   // Distribution
  //   if (data.distribution) {
  //     let distribution = document.createElement('p');
  //     distribution.innerText = `Distribución: ${data.distribution}`;
  //     extra.appendChild(distribution);
  //   }
  //   // Filiation
  //   if (data.filiation) {
  //     let filiation = document.createElement('p');
  //     filiation.innerText = `Filiación: ${data.filiation}`;
  //     extra.appendChild(filiation);
  //   }
  //   // Audience
  //   if (data.audience) {
  //     let audience = document.createElement('p');
  //     audience.innerText = `Público: ${data.audience}`;
  //     extra.appendChild(audience);
  //   }
  //   // Place
  //   if (data.place) {
  //     let place = document.createElement('p');
  //     place.innerText = `${data.place}`;
  //     extra.appendChild(place);
  //   }

  //   x = x === 0 ? this.pad / 2 : x;
  //   extra.className = 'aditional';
  //   ele.className = `eventEle ${data.type}`;
  //   ele.style[transformProp] = `translate(${x}px)`;
  //   ele.style.width = `${w}px`;

  //   ele.appendChild(extra);
    this.eventContainer.appendChild(ele);

    ele.onmouseover = event => {
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

        this.content.style.top = `${view.y + 23}px`;
        this.content.style.left = `${view.x - 75}px`;
      }

    };

    ele.onmouseleave = () => {
      if (!this.content.classList.contains('display')){
        this.content.classList.remove('open');
        this.content.innerText = '';

        if (dateEnd) {
          line.style.width = 0;
        }
      }
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

      if (img) {
        this.content.appendChild(img);
      }

      // if (type) {
      //   this.content.appendChild(type);
      // }

      if (text) {
        this.content.appendChild(text);
      }

      if (links) {
        this.content.appendChild(links);
      }
    }
  }
}

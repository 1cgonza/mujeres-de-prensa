import Base from './TimelineBase';
import {transformProp} from '../utils/shims';
import svg from 'svg.js';

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
    this.parse();
    this.years.sort();
    this.data.sort((a, b) => {
      return a.yearInit - b.yearInit;
    });

    this.pad = 50;
    this.yearStart = this.years[0];
    this.yearEnd = this.years[this.years.length - 1];
    let stageW = window.innerWidth - this.pad - 150;

    let i = this.yearStart - (this.yearStart % 10);
    let end = this.yearEnd - (this.yearEnd % 10) + 10;
    this.yearsStep = stageW / (end - i);

    for (i; i <= end; i += 10) {
      this.createYearEle(i);
    }

    this.data.forEach((event, i) => {
      this.createEventEle(event);
    });
  }

  createYearEle(year) {
    let ele = document.createElement('span');
    let x = (year - this.yearStart) * this.yearsStep;
    ele.className = 'yearEle';
    ele.innerText = year;
    x = x === 0 ? this.pad / 2 : x;
    ele.style[transformProp] = `translateX(${x}px)`;
    this.yearsContainer.appendChild(ele);
  }

  createEventEle(data) {
    let ele = document.createElement('div');
    let title = document.createElement('p');
    let extra = document.createElement('div');
    let x = (data.yearInit - this.yearStart) * this.yearsStep;
    let w = 300;

    if (data.yearEnd) {
      if (data.type === 'periodoPub' || data.type === 'periodoHis') {
        let _w = ((data.yearEnd - data.yearInit) * this.yearsStep) | 0;
        w = _w < w ? w : _w;
        let init = document.createElement('span');
        let line = document.createElement('span');
        let end = document.createElement('span');
        init.className = 'init';
        line.className = 'line';
        end.className = 'end';
        if (_w < w) {
          line.style.width = `${_w}px`;
        } else {
          line.style.width = `${_w - 36}px`;
        }

        ele.appendChild(init);
        ele.appendChild(line);
        ele.appendChild(end);
      }
    }
    // Title
    title.innerText = data.title;
    title.className = 'eventTitle';

    // Time
    if (data.dateInit || date.dateEnd) {
      let date = document.createElement('p');
      let str = '';

      if (data.dateInit && data.dateEnd) {
        str = `${data.dateInit} - ${data.dateEnd}`;
      } else if (data.dateInit) {
        str = `${data.dateInit}`;
      }

      date.className = 'eventDate';
      date.innerText = str;
      extra.appendChild(date);
    }

    // Type
    if (data.type) {
      let type = document.createElement('p');
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
      type.className = 'eventType';
      type.innerText = str;
      extra.appendChild(type);
    }

    // Directors
    if (data.directors) {
      let directors = document.createElement('p');
      directors.innerText = `Dirección / Edición: ${data.directors}`;
      extra.appendChild(directors);
    }
    // Periodicity
    if (data.periodicity) {
      let periodicity = document.createElement('p');
      periodicity.innerText = `Frecuencia: ${data.periodicity}`;
      extra.appendChild(periodicity);
    }
    // Distribution
    if (data.distribution) {
      let distribution = document.createElement('p');
      distribution.innerText = `Distribución: ${data.distribution}`;
      extra.appendChild(distribution);
    }
    // Filiation
    if (data.filiation) {
      let filiation = document.createElement('p');
      filiation.innerText = `Filiación: ${data.filiation}`;
      extra.appendChild(filiation);
    }
    // Audience
    if (data.audience) {
      let audience = document.createElement('p');
      audience.innerText = `Público: ${data.audience}`;
      extra.appendChild(audience);
    }
    // Place
    if (data.place) {
      let place = document.createElement('p');
      place.innerText = `${data.place}`;
      extra.appendChild(place);
    }

    x = x === 0 ? this.pad / 2 : x;
    extra.className = 'aditional';
    ele.className = `eventEle ${data.type}`;
    ele.style[transformProp] = `translate(${x}px)`;
    ele.style.width = `${w}px`;
    ele.appendChild(title);
    ele.appendChild(extra);
    this.eventContainer.appendChild(ele);
    ele.onmouseover = (event) => {
      extra.style.height = `${extra.scrollHeight}px`;
    };
    ele.onmouseleave = (event) => {
      extra.style.height = 0;
    };
  }
}

export default class {
  constructor() {
    this.data = [];
    this.years = [];
  }

  parse() {
    this.events.forEach(event => {
      let d = event.dataset;
      let dateInit = this.parseDate(d.dateInit, true);
      let dateEnd = this.parseDate(d.dateEnd, true);
      let directors = this.parseDirector(d.director);
      let text = this.parseText(d.text);
      let links = this.parseLinks(d.links);
      let place = this.parsePlace(d.place);
      let eventData = {};

      if (dateInit) {
        if (dateInit.year) {
          eventData.yearInit = dateInit.year;

          if (this.years.indexOf(dateInit.year < 0)) {
            this.years.push(dateInit.year);
          }
        }

        if (dateInit.decade) {
          eventData.decade = true;
        }
        eventData.dateInit = dateInit.dateStr;
      }

      if (dateEnd) {
        if (dateEnd.year) {
          eventData.yearEnd = dateEnd.year;

          if (this.years.indexOf(dateEnd.year < 0)) {
            this.years.push(dateEnd.year);
          }
        }
        eventData.dateEnd = dateEnd.dateStr;
      }

      this.data.push(Object.assign(eventData, {
        ele: event,
        title: d.title,
        type: d.eventType || 'noType',
        periodicity: d.periodicity,
        distribution: d.distribution,
        filiation: d.filiation,
        audience: d.audience,
        directors: directors,
        place: place,
        text: text,
        links: links,
        img: d.img
      }));
    });
  }

  parseText(string) {
    let ret = '';

    if (string) {
      let ele = document.createElement('div');
      ele.className = 'eventText';
      ele.innerHTML = string;
      ret = ele;
    }

    return ret;
  }

  parseLinks(arr) {
    if (arr) {
      arr = JSON.parse(arr);
      let links = document.createElement('ul');
      links.className = 'eventLinks';

      arr.forEach(obj => {
        let li = document.createElement('li');
        let a = document.createElement('a');
        a.setAttribute('href', obj.url);
        a.setAttribute('target', '_balnk');
        a.innerText = obj.name;

        li.appendChild(a);
        links.appendChild(li);
      });

      return links;
    }

    return;
  }

  parseDate(obj, checkDecade) {
    if (obj) {
      obj = JSON.parse(obj);
      let date = obj[0];
      let dateStr;
      let year = date.year ? +date.year : null;
      let ret = {};

      if (date.decade) {
        ret.decade = true;
      }

      if (date.month !== 'empty' && date.year) {
        dateStr = `${date.month.charAt(0).toUpperCase() + date.month.slice(1)}, ${date.year}`;
      } else if (date.year) {
        dateStr = date.year;
      }

      return Object.assign(ret, {
        dateStr: dateStr,
        year: year
      });
    }

    return;
  }

  parseDirector(arr) {
    if (arr) {
      let directors = [];
      arr = JSON.parse(arr);

      arr.forEach(obj => {
        directors.push(obj.name);
      });
      return directors.join(', ');
    }

    return '';
  }

  parsePlace(arr) {
    if (arr) {
      arr = JSON.parse(arr);
      let place = arr[0];
      let ret = '';

      if (place.city && place.country) {
        return `${place.city}, ${place.country}`;
      } else if (!place.city && place.country) {
        return place.country;
      } else if (place.city && !place.country) {
        return place.city;
      } else {
        return '';
      }
    }

    return '';
  }
}

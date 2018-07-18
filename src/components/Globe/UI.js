import { magazines } from './constants';
import { el, mount } from 'redom';

export default class UI {
  constructor(container, data, reloadCB, createLineObjectsCB, createCurveObjectsCB, renderAllCB) {
    this.data = data;
    this.reloadCB = reloadCB;
    this.createLineObjectsCB = createLineObjectsCB;
    this.createCurveObjectsCB = createCurveObjectsCB;
    this.renderAllCB = renderAllCB;
    this.children = [];

    this.generateTitle();
    this.children.push(el('span.separator'));
    this.generateViewAll();
    this.children.push(el('span.separator'));
    this.generateExtP();
    this.children.push(el('span.separator'));
    this.generateExtM();
    this.children.push(el('span.separator'));
    this.generateNatP();
    this.children.push(el('span.separator'));
    this.generateNatM();

    this.box = el('div.box');
    const menu = el('div.menuWrapper', this.children);

    mount(container, this.box);
    mount(container, menu);
  }

  resetCurrent = (ele) => {
    this.children.forEach(ele => {
      ele.classList.remove('current');
    });
    ele.classList.add('current');
  };

  generateTitle() {
    const title = el('h1.title', 'Lugares');
    const desc = el('span.desc', 'Haz clic en los títulos para filtrar los datos');
    this.children.push(title);
    this.children.push(desc);
  }

  generateViewAll() {
    const btn = el('p.label.viewAll', 'Ver todos');
    btn.onclick = () => {
      this.reloadCB();
      this.resetCurrent(btn);
      this.renderAllCB();
    };
    this.children.push(btn);
  }

  generateExtP() {
    const label = el('p.label.extP', 'Cartas del exterior');
    label.onclick = () => {
      this.reloadCB();
      this.resetCurrent(label);
      this.createCurveObjectsCB(this.data.extProcedencia);
    };
    this.children.push(label);

    magazines.forEach(obj => {
      let d = this.data.extProcedencia.filter(place => place.magazines.hasOwnProperty(obj.key));

      if (d.length) {
        let ele = el(`p.child.extP.${obj.slug}`, obj.name);
        ele.onclick = (ev) => {
          this.reloadCB();
          this.resetCurrent(ele);
          this.createCurveObjectsCB(d, obj.slug);
        };
        this.children.push(ele);
      }
    });
  }

  generateExtM() {
    const label = el('p.label.extM', 'Menciones al exterior');
    label.onclick = () => {
      this.reloadCB();
      this.resetCurrent(label);
      this.createLineObjectsCB(this.data.extMencion);
    };
    this.children.push(label);

    magazines.forEach(obj => {
      let d = this.data.extMencion.filter(place => place.magazines.hasOwnProperty(obj.key));

      if (d.length) {
        let ele = el(`p.child.extM.${obj.slug}`, obj.name);
        ele.onclick = (ev) => {
          this.reloadCB();
          this.resetCurrent(ele);
          this.createLineObjectsCB(d, obj.slug);
        };
        this.children.push(ele);
      }
    });
  }

  generateNatP() {
    const label = el('p.label.natP', 'Cartas de Colombia');
    label.onclick = () => {
      this.reloadCB();
      this.resetCurrent(label);
      this.createLineObjectsCB(this.data.natProcedencia);
    };
    this.children.push(label);

    magazines.forEach(obj => {
      let d = this.data.natProcedencia.filter(place => place.magazines.hasOwnProperty(obj.key));

      if (d.length) {
        let ele = el(`p.child.natP.${obj.slug}`, obj.name);
        ele.onclick = (ev) => {
          this.reloadCB();
          this.resetCurrent(ele);
          this.createLineObjectsCB(d, obj.slug);
        };
        this.children.push(ele);
      }
    });
  }

  generateNatM() {
    const label = el('p.label.natM', 'Menciones a lugares en Colombia');
    label.onclick = () => {
      this.reloadCB();
      this.resetCurrent(label);
      this.createLineObjectsCB(this.data.natMencion);
    };
    this.children.push(label);

    magazines.forEach(obj => {
      let d = this.data.natMencion.filter(place => place.magazines.hasOwnProperty(obj.key));

      if (d.length) {
        let ele = el(`p.child.natP.${obj.slug}`, obj.name);
        ele.onclick = (ev) => {
          this.reloadCB();
          this.resetCurrent(ele);
          this.createLineObjectsCB(d, obj.slug);
        };
        this.children.push(ele);
      }
    });
  }
}

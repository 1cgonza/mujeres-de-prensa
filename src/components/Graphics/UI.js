import { el, mount } from 'redom';
import { structureOrn } from './constants';

export default class UI {
  constructor(container, imgWrapper, grid) {
    this.children = [];
    this.imgWrapper = imgWrapper;
    this.grid = grid;

    this.generateTitle();

    for (let key in structureOrn) {
      this.generateSelects(key, structureOrn[key]);
    }

    const menu = el('div.menuWrapper.m-100.t-30.d-20.ld-20', this.children);
    mount(container, menu);
  }

  generateTitle() {
    const title = el('h1.title', 'El taller gráfico');
    this.children.push(title);
  }

  handleSelect = (e) => {
    let val = e.target.value;
    let found = this.imgWrapper.querySelectorAll(`.${val}`);

    if (e.target.checked) {
      found.forEach(ele => {
        ele.classList.remove('hidden');
        this.grid.update();
      });
    } else {
      found.forEach(ele => {
        ele.classList.add('hidden');
        this.grid.update();
      });
    }
  };

  generateSelects(name, group) {
    let lis = [];

    group.forEach(obj => {
      lis.push(
        el('label.checkWrap',
          el('input', {
            type: 'checkbox',
            value: `${obj.id}-${obj.key}`,
            checked: true,
            onchange: this.handleSelect
          }),
          el('span.checkLabel', obj.name)
        )
      );
    });

    this.children.push(
      el(`div.multiSelect.${name}`,
        el('div.checkboxesContainer', el('span.label', name), lis)
      )
    );
  }
}

import req from '../../utils/req';
import { structureOrn } from './constants';
import UI from './UI';
import { el, mount } from 'redom';
import Bricks from 'bricks.js';

export default class Graphics {
  constructor(container) {
    container.classList.add('gridWrapper');
    req('/assets/db/ornamentos.json').then(res => {
      res.sort((a, b) => 0.5 - Math.random());
      const wrapper = el('div.imgWrapper.m-100.t-70.d-80.ld-80');

      res.forEach(obj => {
        const mRef = structureOrn.Revista.find(ref => ref.name === obj.magazine);
        const tRef = structureOrn.Tipo.find(ref => ref.name === obj.oType);
        const fRef = structureOrn.Forma.find(ref => ref.name === obj.form);
        const uRef = structureOrn.Uso.find(ref => ref.name === obj.use);

        let imgCont = document.createElement('div');
        imgCont.className = `gridEle ${mRef.id}-${mRef.key} ${tRef.id}-${tRef.key} ${fRef.id}-${fRef.key} ${uRef.id}-${uRef.key}`;

        Object.assign(imgCont.style, {
          backgroundImage: `url(/assets/imgs/ornamentos/${obj.name})`,
          width: '200px',
          height: `${obj.h}px`
        });

        wrapper.appendChild(imgCont);
      });
      container.appendChild(wrapper);

      const sizes = [
        {columns: 2, gutter: 0},
        {mq: '768px', columns: 2, gutter: 5},
        {mq: '1030px', columns: 4, gutter: 5},
        {mq: '1547px', columns: 6, gutter: 5}
      ];

      const grid = Bricks({
        container: '.imgWrapper',
        packed: 'data-packed',
        sizes: sizes
      });

      grid.pack();
      grid.resize(true);

      this.ui = new UI(container, wrapper, grid);

    });
  }
}

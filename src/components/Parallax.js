import { loop, transformProp } from '../utils/shims';

export default class Parallax {
  constructor(ele) {
    if (!ele) {
      return;
    }
    this.container = ele;
    this.sections = ele.querySelectorAll('section');
    this.innerGrids = {
      columns: ele.querySelectorAll('.columns'),
      data: [],
      fixedCols: []
    };
    this.ticking = false;
    this.oldY = 0;

    this.initStyles();
    this.getInnerGridsData();
    this.setup();

    window.addEventListener('scroll', this.onScroll, false);
    window.addEventListener('resize', this.setup, false);
  }

  onScroll = () => {
    this.oldY = window.scrollY;
    this.requestTick();
  };

  setup() {
    console.log('setup');
  }

  initStyles() {
    if (this.sections) {
      this.sections.forEach((section, i) => {
        section.style.zIndex = this.sections.length - i;
      });
    }
  }

  getInnerGridsData() {
    if (this.innerGrids.columns) {
      this.innerGrids.data = [];
      this.innerGrids.fixedCols = [];

      this.innerGrids.columns.forEach((grid, i) => {
        let fixedCol = grid.querySelector('.fixedCol');

        this.innerGrids.data[i] = {
          top: grid.offsetTop,
          height: grid.offsetHeight
        };

        // if section is inside an area, get offset top from the parent
        if (grid.closest('.apos-area') && grid.closest('.apos-area-widget-wrapper')) {
          this.innerGrids.data[i].top = grid.closest('.apos-area').offsetTop + grid.closest('.apos-area-widget-wrapper').offsetTop;
        }

        if (fixedCol) {
          this.innerGrids.fixedCols[i] = fixedCol;
        } else {
          console.error('No .fixedCol class found for', grid, ' - Check HTML.');
        }
      });
    }
  }

  update = () => {
    let newY = this.oldY;

    // sections.forEach(function(section, i) {
    //   var d = data[i];

    //   if (newY < d.top) {
    //     section.style[transformProp] = 'translateY(' + (newY - d.top) + 'px)';
    //   }
    // });

    this.innerGrids.columns.forEach((grid, i) => {
      let fixed = this.innerGrids.fixedCols[i];
      let d = this.innerGrids.data[i];
      let fixedH = fixed.offsetHeight;
      let limit = d.top + d.height - fixedH;

      if (fixed) {
        if (newY >= d.top && newY < limit) {
          fixed.style[transformProp] = 'translateY(' + (newY - d.top) + 'px)';
        } else if (newY >= limit) {
          fixed.style[transformProp] = 'translateY(' + (d.height - fixedH) + 'px)';
        } else {
          fixed.style[transformProp] = 'translateY(0px)';
        }
      }

    });

    this.ticking = false;
  }

  requestTick() {
    if (!this.ticking) {
      loop(this.update);
      this.ticking = true;
    }
  }
}

export default class Menu {
  constructor() {
    this.menu = document.getElementById('siteMenu');
    this.menuBtn = document.getElementById('siteMenuIcon');
    this.blackout = document.getElementById('blackout');
    this.links = document.querySelectorAll('.pageLink');
    this.init();
    this.menuBtn.addEventListener('click', this.onMenuClick, false);
  }

  init() {
    this.links.forEach(link => {
      if (link.classList.contains('current')) {
        link.style.color = link.dataset.color;
        link.style.pointerEvents = 'none';
      } else {
        link.onmouseover = (event) => {
          let _self = event.target;
          _self.style.color = _self.dataset.color;
        };

        link.onmouseout = (event) => {
          let _self = event.target;
          _self.style.color = 'initial';
        };
      }
    });
  }

  onMenuClick = () => {
    let menu = this.menu;
    menu.classList.toggle('active');

    if (menu.classList.contains('active')) {
      this.blackout.classList.remove('hidden');
      this.hideOnClickOutside(menu);
    } else {
      this.blackout.classList.add('hidden');
    }
  }

  hideOnClickOutside(element) {
    const outsideClickListener = event => {
      if (event.target !== this.menuBtn) {
        if (!element.contains(event.target)) {
          this.menu.classList.remove('active');
          this.blackout.classList.add('hidden');
          removeClickListener();
        }
      }
    };

    const removeClickListener = () => {
      document.removeEventListener('click', outsideClickListener);
    }

    document.addEventListener('click', outsideClickListener);
  }
}

export default class Gallery {
  constructor(selector) {
    var galleryElements = document.querySelectorAll(selector);

    for (var i = 0, l = galleryElements.length; i < l; i++) {
      galleryElements[i].setAttribute('data-pswp-uid', i + 1);
      galleryElements[i].onclick = this.onThumbnailsClick;
    }

    var hashData = this.photoswipeParseHash();
    if (hashData.pid && hashData.gid) {
      this.openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
    }
  }

  closest(el, fn) {
    return el && (fn(el) ? el : this.closest(el.parentNode, fn));
  }

  onThumbnailsClick = (e) => {
    e = e || window.event;
    e.preventDefault ? e.preventDefault() : e.returnValue = false;

    var eTarget = e.target || e.srcElement;
    var clickedListItem = this.closest(eTarget, (el) => {
      return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
    });

    if (!clickedListItem) {
      return;
    }

    var clickedGallery = clickedListItem.parentNode;
    var childNodes = clickedListItem.parentNode.childNodes;
    var numChildNodes = childNodes.length;
    var nodeIndex = 0;
    var index;

    for (var i = 0; i < numChildNodes; i++) {
      if (childNodes[i].nodeType !== 1) {
        continue;
      }

      if (childNodes[i] === clickedListItem) {
        index = nodeIndex;
        break;
      }
      nodeIndex++;
    }

    if (index >= 0) {
      this.openPhotoSwipe(index, clickedGallery);
    }
    return false;
  };

  parseThumbnailElements(el) {
    var thumbElements = el.childNodes;
    var numNodes = thumbElements.length;
    var items = [];
    var figureEl;
    var linkEl;
    var size;
    var item;

    for (var i = 0; i < numNodes; i++) {
      figureEl = thumbElements[i];

      if (figureEl.nodeType !== 1) {
        continue;
      }

      linkEl = figureEl.children[0];
      size = linkEl.getAttribute('data-size').split('x');

      item = {
        src: linkEl.getAttribute('href'),
        w: parseInt(size[0], 10),
        h: parseInt(size[1], 10)
      };

      if (figureEl.children.length > 1) {
        item.title = figureEl.children[1].innerHTML;
      }

      if (linkEl.children.length > 0) {
        item.msrc = linkEl.children[0].getAttribute('src');
      }

      item.el = figureEl;
      items.push(item);
    }

    return items;
  }

  openPhotoSwipe(index, galleryElement, disableAnimation, fromURL) {
    var pswpElement = document.querySelectorAll('.pswp')[0];
    var gallery;
    var options;
    var items = this.parseThumbnailElements(galleryElement);

    options = {
      galleryUID: galleryElement.getAttribute('data-pswp-uid'),

      getThumbBoundsFn: function(index) {
        var thumbnail = items[index].el.getElementsByTagName('img')[0];
        var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
        var rect = thumbnail.getBoundingClientRect();

        return {
          x: rect.left,
          y: rect.top + pageYScroll,
          w: rect.width
        };
      }

    };

    if (fromURL) {
      if (options.galleryPIDs) {
        for (var j = 0; j < items.length; j++) {
          if (items[j].pid == index) {
            options.index = j;
            break;
          }
        }
      } else {
        options.index = parseInt(index, 10) - 1;
      }
    } else {
      options.index = parseInt(index, 10);
    }

    if (isNaN(options.index)) {
      return;
    }

    if (disableAnimation) {
      options.showAnimationDuration = 0;
    }

    gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
  };

  photoswipeParseHash() {
    var hash = window.location.hash.substring(1);
    var params = {};

    if (hash.length < 5) {
      return params;
    }

    var vars = hash.split('&');
    for (var i = 0; i < vars.length; i++) {
      if (!vars[i]) {
        continue;
      }
      var pair = vars[i].split('=');
      if (pair.length < 2) {
        continue;
      }
      params[pair[0]] = pair[1];
    }

    if (params.gid) {
      params.gid = parseInt(params.gid, 10);
    }

    return params;
  };
}

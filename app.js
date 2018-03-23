var path = require('path');

var apos = require('apostrophe')({
  shortName: 'pasadoimpreso',
  modules: {
    'apostrophe-templates': {
      viewsFolderFallback: path.join(__dirname, 'views')
    },
    'parallax-section-widgets': {},
    'profiles-widgets': {}
  }
});

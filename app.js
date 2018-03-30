var path = require('path');

var apos = require('apostrophe')({
  shortName: 'pasadoimpreso',
  modules: {
    'apostrophe-templates': {
      viewsFolderFallback: path.join(__dirname, 'views')
    },
    'profiles-widgets': {},
    'link-widgets': {},
    'page-link-widgets': {},
    'illustrations-widgets': {}
  }
});

// This module does not get declared in app.js
// https://apostrophecms.org/docs/tutorials/intermediate/custom-schema-fields-for-pages.html

module.exports = {
  beforeConstruct: function(self, options) {
    options.arrangeFields = [
      {
        'name': 'seo',
        'label': 'SEO',
        'fields': ['ogImage', 'seoDescription']
      }
    ].concat(options.arrangeFields || []);

    options.addFields = [
      {
        name: 'seoDescription',
        label: 'Description',
        type: 'string',
        textarea: true,
        max: 320
      },
      {
        type: 'singleton',
        widgetType: 'apostrophe-images',
        name: 'ogImage',
        label: 'Open Graph image (Social Media)',
        options: {
          limit: 1,
          size: 'full',
          controls: {
            movable: false
          }
        }
      }
    ].concat(options.addFields || []);
  }
};

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'New Gallery',
  wrapperTemplate: 'wrapper',
  addFields: [
    {
      type: 'singleton',
      widgetType: 'apostrophe-images',
      name: 'galleryImg',
      label: 'Image'
    }
  ],
  construct: function(self, options) {
    var superPushAssets = self.pushAssets;
    self.pushAssets = function() {
      superPushAssets();
      self.pushAsset('stylesheet', 'always', {
        when: 'always'
      });
    };
  }
};

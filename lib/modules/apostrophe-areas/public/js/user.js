apos.define('apostrophe-areas', {
  construct: function(self, options) {
    var superEnableCkeditor = self.enableCkeditor;
    self.enableCkeditor = function() {
      superEnableCkeditor();
      CKEDITOR.plugins.addExternal('font',          '/modules/my-apostrophe-areas/js/ckeditorPlugins/font/');
      CKEDITOR.plugins.addExternal('sourcedialog',  '/modules/my-apostrophe-areas/js/ckeditorPlugins/sourcedialog/');
    };
  }
});

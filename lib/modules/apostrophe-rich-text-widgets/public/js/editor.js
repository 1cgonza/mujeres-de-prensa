apos.define('apostrophe-rich-text-widgets-editor', {
  construct: function(self, options) {
    self.beforeCkeditorInline = function() {
      self.config.extraPlugins = 'font,sourcedialog';
      self.config.font_defaultLabel = options.defaultFont ? options.defaultFont : 'Playfair Display',
      self.config.font_names = 
        'Playfair Display/Playfair Display, Times New Roman, Times, serif;' +
        'Montserrat/Montserrat, Open Sans, Helvetica, Arial, sans-serif;' +
        'Lato/Lato, Open Sans, Helvetica, Arial, sans-serif;' +
        'Abril Fatface/Abril Fatface, cursive;' +
        'EB Garamond/EB Garamond, Times New Roman, Times, serif;' +
        'Lora/Lora, Times New Roman, Times, serif;' +
        'Pacifico/Pacifico, cursive;';
      self.config.font_style = {
        element: 'span',
        styles: {'font-family': '#(family)'},
        overrides: [{element: 'font', attributes: {'face': null}}]
      };
    };
  }
});
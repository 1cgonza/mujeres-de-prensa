module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Parallax Section',
  addFields: [
    {
      type: 'range',
      name: 'speed',
      label: 'Parallax speed',
      min: -10,
      max: 10,
      step: 1
    },
    {
      type: 'select',
      name: 'layout',
      label: 'Layout',
      choices: [
        {
          label: '1 Column',
          value: 'cols1'
        },
        {
          label: '2 Columns',
          value: 'cols2'
        }
      ]
    },
    {
      name: 'background',
      label: 'Background Image',
      type: 'attachment'
    }
  ],
  construct: function(self, options) {
    self.pushAsset('script', 'rellax', {when: 'always'});
  }
};

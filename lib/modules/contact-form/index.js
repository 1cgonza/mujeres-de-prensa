var async = require('async');

module.exports = {
  extend: 'apostrophe-pieces',
  name: 'contact-form',
  label: 'Contact Form',
  alias: 'contactForm',
  addFields: [
    {
      name: 'name',
      type: 'string',
      label: 'Nombre',
      required: true
    },
    {
      name: 'email',
      type: 'string',
      label: 'Email',
      required: true
    },
    {
      name: 'title',
      type: 'string',
      label: 'Asunto',
      required: true
    },
    {
      name: 'body',
      type: 'string',
      label: 'Mensaje',
      textarea: true,
    }
  ],
  permissionsFields: false,

  afterConstruct: function(self) {
    self.setSubmitSchema();
  },

  construct: function(self, options) {

    self.setSubmitSchema = function() {
      self.submitSchema = self.apos.schemas.subset(self.schema,
        ['name', 'email', 'title', 'body']
      );
    };

    self.submit = function(req, callback) {
      var piece = {};
      return async.series([
        convert,
        insert
      ], callback);
      function convert(callback) {
        return self.apos.schemas.convert(req, self.schema, 'form', req.body, piece, callback);
      }
      function insert(callback) {
        return self.insert(req, piece, {
          permissions: false
        }, callback);
      }
    };

  }
};

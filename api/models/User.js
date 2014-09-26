module.exports = {

  attributes: {
    active: {
      type: 'boolean',
      defaultsTo: false,
      required: true
    },
    email: {
      type: 'email'
    },
    password: {
      type: 'string'
    },
    displayName: {
      type: 'string'
    },
    provider: {
      type: 'string'
    },
    providerId: {
     type: 'string'
    }
  }

};

require('dotenv').config();

module.exports = {
  development: {
    ...require('./database/config/database'),
  },
  production: {
    ...require('./database/config/database'),
  },
};

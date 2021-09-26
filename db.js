const { Sequelize } = require('sequelize');
const {
  DATA_BASE_URI,
  DATA_BASE_NAME,
  DATA_BASE_USER,
  DATA_BASE_PORT,
  DATA_BASE_PASSWORD,
  DATA_BASE_HOST,
} = require('./procesEnv');

module.exports = new Sequelize(DATA_BASE_URI, {
  //logging: false,// отключение логирования
  ssl: true,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

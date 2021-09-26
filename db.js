const { Sequelize } = require('sequelize');
//const { DATABASE_URL } = require('./procesEnv');
const urlDB = process.env.DATABASE_URL
module.exports = new Sequelize(urlDB, {
  //logging: false,// отключение логирования
  ssl: true,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

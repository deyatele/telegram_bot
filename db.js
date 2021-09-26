const { Sequelize } = require('sequelize');
//const { DATABASE_URL } = require('./procesEnv');
const DATABASE_URL = process.env.DATABASE_URL
module.exports = new Sequelize(DATABASE_URL, 
    {
  logging: false,// отключение логирования
  ssl: true,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
}
);

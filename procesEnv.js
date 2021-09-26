require('dotenv').config();

const token = process.env.TOKEN;
const DATA_BASE_NAME = process.env.DATA_BASE_NAME;
const DATA_BASE_USER = process.env.DATA_BASE_USER;
const DATA_BASE_PORT = process.env.DATA_BASE_PORT;
const DATA_BASE_PASSWORD = process.env.DATA_BASE_PASSWORD;
const DATA_BASE_HOST = process.env.DATA_BASE_HOST;

const DATA_BASE_URI = `postgres://${DATA_BASE_USER}:${DATA_BASE_PASSWORD}@${DATA_BASE_HOST}:${DATA_BASE_PORT}/${DATA_BASE_NAME}`;

module.exports = {
  token,
  DATA_BASE_URI,
  DATA_BASE_NAME,
  DATA_BASE_USER,
  DATA_BASE_PORT,
  DATA_BASE_PASSWORD,
  DATA_BASE_HOST,
};

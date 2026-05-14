const mariadb = require("mariadb");
const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "..", ".env"),
  quiet: true,
});

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectionLimit: 20,
});

module.exports = pool;

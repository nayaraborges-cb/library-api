import { Dialect } from "sequelize";

module.exports = {
  dialect: 'postgres' as Dialect,
  host: process.env.DB_HOST,
  port: Number (process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  logging: false,
};

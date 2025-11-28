import { Dialect } from "sequelize";

const config = {
 
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '961723',
    database: process.env.DB_NAME || 'userbook',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    dialect: 'postgres' as Dialect,

};

module.exports = config;

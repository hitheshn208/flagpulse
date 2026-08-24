const {Pool} = require('pg');

const db = new Pool({
    user: process.env.DB_USER,
    host: "postgres",
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432
});

module.exports = db;
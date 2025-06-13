const mysql2 = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const db_host = process.env.DB_HOST || 'localhost';
const db_user = process.env.DB_USER || 'root';
const db_pass = process.env.DB_PASS || '';
const db_name = process.env.DB_NAME || 'mydb';


const pool = mysql2.createPool({
    host: db_host,
    user: db_user,
    password: db_pass,
    database: db_name,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();
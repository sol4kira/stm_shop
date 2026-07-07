const mySql = require('mysql2');
require('dotenv').config({ path: 'C://Users//kirasol4//Desktop//STM shop manegment//backend//.env' });

const pool= mySql.createPool({
    user: process.env.db_Username,
    host: process.env.db_Host,
    password: process.env.db_Password,
    database: process.env.db_Database,
    waitForConnections: true,
    connectionLimit:10,
    queueLimit:0
});

module.exports = pool.promise();
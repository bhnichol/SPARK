require('dotenv').config();
const dbConnection = {
        user: process.env.DB_USER,     // Replace with your username
        password: process.env.DB_PWD,       // Replace with your password
        connectString: process.env.CONNECT_STRING,   
        poolMin: 2,
        poolMax: 10,
        poolIncrement: 1
    };
module.exports = dbConnection;

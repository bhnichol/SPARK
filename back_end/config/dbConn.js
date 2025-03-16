const dbConnection = {
        user: process.env.DB_USER,     // Replace with your RDS username
        password: process.env.DB_PWD,       // Replace with your RDS password
        server: process.env.CONNECT_STRING,              // Replace with your AWS RDS endpoint
        port: 1433,                        // Default SQL Server port
        database: 'SPARK',  // Name of your target database
        options: {
            encrypt: false,                 // Use encryption for data-in-transit
            trustServerCertificate: true // Required for some environments
        }
    };
module.exports = dbConnection;

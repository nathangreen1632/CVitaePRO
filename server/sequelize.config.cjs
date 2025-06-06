require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres'
    },
    test: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: 'cvitaepro_test_db',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres'
    },
    production: {
        use_env_variable: 'DB_URL',
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
};

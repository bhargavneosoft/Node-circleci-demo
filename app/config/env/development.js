require('dotenv').config();

export default {
    server: 'dev',
    host: process.env.APP_URL,
    port: process.env.APP_PORT,
    dev: {
        host: process.env.APP_URL,
        port: process.env.APP_PORT
    },
    database: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dbName: process.env.DB_DATABASE,
        username: '',
        password: ''
    },
    excludedRoutes: [
        '/users/createAdmin',
        '/users/login',
        '/users/forgotPassword',
        '/roles/create',
        '/users/verify-code',
        '/roles'
    ],
    API_KEY: {
        api_key: 'd71a0600eb536f75c2d6de65f18628b5'
    },
    SWAGGER_URL: ''
};

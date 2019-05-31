import  development from './env/development';
var config = {
    development
};

/**
 * set the env variable 'process.env.NODE_ENV' to 'development' for development server and 'production' for production server.
 * 
 */
export default config[process.env.NODE_ENV || 'development'];
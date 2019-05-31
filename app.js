import express from 'express';
import bodyParser from 'body-parser';
import Mongoose from 'mongoose';
import Passport from 'passport';
import cors from 'cors';
import Morgan from 'morgan';
import appConfig from './config/config';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import tokenChecker from './services/token-interceptor';
import path from 'path';
import dotenv from 'dotenv';
import cluster from 'cluster'
var app = express();

if (cluster.isMaster) {
    var count = 4;
    for (var i = 0; i < count; i++) {
        cluster.fork();
    }
    cluster.on('online', (worker) => {
        console.log('Worker ' + worker.process.pid + ' is online')
    })
    cluster.on('exit', (worker, code, signal) => {
        console.log('Worker ' + worker.process.pid + ' died with ' + code + ' and signal ' + signal);
        console.log('start new worker');
        cluster.fork();
    })
} else {
    dotenv.config();

    Mongoose.Promise = global.Promise;
    Mongoose.set('useCreateIndex', true);
    Mongoose.connect('mongodb://' + appConfig.database.host + '/' + appConfig.database.dbName, { useNewUrlParser: true });

    Mongoose.connection.on('error', () => {
        throw new Error(`Unable to connect to database`);
    });
    Mongoose.connection.on('connected', () => {
        console.log(`Connected to database`);
    });

    app.use(express.static(path.join(__dirname, 'client/build')));

    const swaggerDocument = YAML.load('./api_doc/swagger/swagger.yaml');
    swaggerDocument.host = appConfig.SWAGGER_URL;

    const swagOptions = {
        explorer: false,
        customCss: '.swagger-ui .topbar { display: none }'
    };
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swagOptions));

    // Cross origin
    app.use(cors());

    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

    // Passport init
    app.use(Passport.initialize());
    app.use(Passport.session());

    // Creates server logs
    app.use(Morgan('dev'));

    app.use((req, res, next) => {
        tokenChecker.interceptor(req, res, next);
        var now = new Date().toString();
        console.log(`${now}`);
    });

    // Use the custom routes
    require('./server/routes/index')(app);

    // Set port
    app.set('port', process.env.PORT || appConfig[appConfig.server].port);
    app.set('host', process.env.HOST || appConfig[appConfig.server].host);

    app.listen(app.get('port'), function () {
        console.log('Server started at ' + app.get('host') + ':' + app.get('port'));
    });
}

export default app;


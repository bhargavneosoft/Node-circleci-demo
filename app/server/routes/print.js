var Express = require('express'),
    Router = Express.Router(),
    printController = require('../modules/print/printCtrl');

Router.route('/').post(printController.printData);

module.exports = Router;
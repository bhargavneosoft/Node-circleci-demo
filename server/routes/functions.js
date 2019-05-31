var Express = require('express'),
    Router = Express.Router(),
    functionController = require('../modules/functions/functionsCtrl');

Router.route('/create').all().post(functionController.createFunctions);
Router.route('/initialize').all().post(functionController.initializeFunction);

module.exports = Router;

var Express = require('express'),
    Router = Express.Router(),
    QAController = require('../modules/QA/QACtrl');

Router.route('/approval').post(QAController.QAInput);

module.exports = Router;
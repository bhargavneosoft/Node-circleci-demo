var Express = require('express'),
	Router = Express.Router(),
	//    clientController = require('../modules/clients/clientCtrl'),
	eventController = require('../modules/eventLog/eventLogCtrl');

Router.route('/').get(eventController.eventLogList);
Router.route('/getdata/:id/:log').get(eventController.getEventLogData);

module.exports = Router;

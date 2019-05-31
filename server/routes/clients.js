var Express = require('express'),
	Router = Express.Router(),
	clientController = require('../modules/clients/clientCtrl');

Router.route('/').post(clientController.clientSetup);

Router.route('/update/:revision_id/:event_id').put(clientController.updateClient);

Router.route('/list').get(clientController.getClients);

module.exports = Router;

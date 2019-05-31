var Express = require('express'),
	Router = Express.Router(),
	nclController = require('../modules/ncl/ncl_ctrl');

Router.route('/').post(nclController.createDefaultNCL);

Router.route('/:ncl_id/:event_id').put(nclController.updateNCL);

module.exports = Router;

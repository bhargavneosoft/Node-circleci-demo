var Express = require('express'),
	Router = Express.Router(),
	roleController = require('../modules/roles/roleCtrl');

Router.route('/create').all().post(roleController.createRoleData);

Router.route('/').all().get(roleController.getRoles);

module.exports = Router;

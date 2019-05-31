var Express = require('express'),
	Router = Express.Router(),
	userController = require('../modules/users/userCtrl'),
	clientController = require('../modules/clients/clientCtrl');

Router.route('/createAdmin').post(userController.register);

Router.route('/create').post(userController.createUsers);

Router.route('/login').post(userController.login);

Router.route('/forgotPassword').post(userController.forgotPassword);

Router.route('/verify-code').post(userController.updatePasswordAfterForgotCode);

Router.route('/changePassword').put(userController.changePassword);

Router.route('/:id').get(userController.fetchUser).put(userController.updateUser).delete(userController.deleteUser);

Router.route('/').get(userController.getOperatorsAndQAs);

module.exports = Router;

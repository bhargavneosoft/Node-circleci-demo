var Express = require('express'),
	Router = Express.Router(),
	CtosController = require('../modules/ctos/ctosCtrl'),
	inboundCtrl = require('../modules/inboundReceipt/inboundCtrl');

/*  CTOS Routes */
Router.route('/').post(CtosController.ctosSetup);
Router.route('/update/:revision_id/:event_id').put(CtosController.updateCtos);

/*  Inbound Routes  */
Router.route('/initial_4_1').post(inboundCtrl.initial_4_1);
Router.route('/update_4_1/:ir_id/:event_id').post(inboundCtrl.update_4_1);
Router.route('/initial_4_2').post(inboundCtrl.initial4_2);
Router.route('/update_4_2/:ir_id/:event_id').post(inboundCtrl.update4_2);

module.exports = Router;

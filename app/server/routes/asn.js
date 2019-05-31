var Express = require('express'),
    Router = Express.Router(),
    asnController = require('../modules/ASN/ASNctrl');

Router.route('/initial_create').post(asnController.createDefaultASN);
Router.route('/update/:asn_id/:event_id').put(asnController.updateASN);
Router.route('/inbound_approval/:asn_id').put(asnController.inboundStatusChange);

module.exports = Router;

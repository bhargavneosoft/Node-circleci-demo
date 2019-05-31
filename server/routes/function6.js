var Express = require('express'),
    Router = Express.Router(),
    function6_Controller = require('../modules/function6/function6_1_ctrl');

Router.route('/initial_6_1').post(function6_Controller.initial_6_1);
Router.route('/update_6_1/:function6_id/:event_id').put(function6_Controller.update_6_1);
Router.route('/initial_6_2').post(function6_Controller.initial_6_2);
Router.route('/update_6_2/:function6_id/:event_id').put(function6_Controller.update_6_2);

module.exports = Router;

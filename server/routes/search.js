var Express = require('express'),
    Router = Express.Router(),
    searchController = require('../modules/search/searchCtrl');

Router.route('/').post(searchController.search);

module.exports = Router;
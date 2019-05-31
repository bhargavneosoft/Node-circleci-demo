/**
 * 'require-dir' module gives all the files in current files directory
 * (.i.e. All files from 'routes' dir) in form of key: value pair
 * (i.e. {users: require('./users'))
 */
var Routes = require('require-dir')();

module.exports = function(app) {
	Object.keys(Routes).forEach(function(route) {
		app.use('/' + route, Routes[route]);
	});
};

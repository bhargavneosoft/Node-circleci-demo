import secrets from '../config/secrets';
import JWT from 'jsonwebtoken';
import user from '../server/modules/users/userModel';
import apiHandler from '../services/api-handler';
import appConfig from '../config/config';

export default {
	interceptor: (req, res, next) => {
		var excludedRoutes = appConfig.excludedRoutes, // public routes
			token,
			apikey = req.headers.apikey,
			api_key = process.env.API_KEY || appConfig.API_KEY.api_key;

		if (apikey === api_key) {
			if (excludedRoutes.indexOf(req.path) === -1) {
				// private routes
				token = req.headers.token || req.body.token || req.headers['x-access-token'];
				if (token) {
					JWT.verify(token, secrets.jwtSecret, (err, decoded) => {
						if (err) {
							apiHandler.setErrorResponse('INVALID_TOKEN', res, req);
						} else {
							user.getUserById(decoded.userId, (err, user) => {
								if (err) {
									apiHandler.setErrorResponse('UNKNOWN_ERROR', res, req);
								} else if (!user) {
									apiHandler.setErrorResponse('INVALID_TOKEN', res, req);
								} else {
									if (user.isActive) {
										req.decoded = decoded;
										req.user = user;
										next();
									} else {
										apiHandler.setErrorResponse('INVALID_TOKEN', res, req);
									}
								}
							});
						}
					});
				} else {
					apiHandler.setErrorResponse('INVALID_TOKEN', res, req);
				}
			} else {
				next();
			}
		} else {
			apiHandler.setErrorResponse('INVALID_APIKEY', res, req);
		}
	}
};

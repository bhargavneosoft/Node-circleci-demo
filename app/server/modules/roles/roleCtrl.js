import model from '../../schema';
import apiHandler from '../../../services/api-handler';

/**
 * API to create role data.
 * @param req
 * @param res
 */
export const createRoleData = (req, res) => {
	var docs = [],
		rolesArray = [ 'admin', 'operator', 'client', 'qa' ];
	rolesArray.forEach((roleName) => {
		docs.push({ name: roleName });
	});
	model.roles.getAllRoles((err, roles) => {
		if (err || !roles) {
			apiHandler.setErrorResponse('UNKNOWN_ERROR', res, req);
		} else {
			model.roles.createRole(docs, (err, results) => {
				if (err) {
					apiHandler.setErrorResponse('UNKNOWN_ERROR', res, req);
				} else {
					apiHandler.setSuccessResponse({ message: 'Roles created successfully' }, res, req);
				}
			});
		}
	});
};

/**
 * API to get role data.
 * @param req
 * @param res
 */
export const getRoles = (req, res) => {
	model.roles.getAllRoles((err, roles) => {
		if (err || !roles) {
			apiHandler.setErrorResponse('UNKNOWN_ERROR', res, req);
		} else {
			apiHandler.setSuccessResponse({ roles: roles }, res, req);
		}
	});
};

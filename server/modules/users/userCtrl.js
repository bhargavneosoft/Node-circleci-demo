import Passport from 'passport';
const LocalStrategy = require('passport-local').Strategy;
import validator from 'validator';
import jWT from '../../helpers/jwt';
import apiHandler from '../../../services/api-handler';
import _ from 'lodash';
import changeCase from 'change-case';
import randomstring from 'randomstring';
import mailer from '../../../services/send-mail';
import model from '../../schema';
import { padDigitsForOperator } from '../../helpers/utils';
import escapeStringRegexp from 'escape-string-regexp';

/**
 * API to register into the application
 * @param req
 * @param res
 */
export const register = (req, res) => {
	let userToken = {};
	if (
		validator.isEmpty(req.body.name) ||
		validator.isEmpty(req.body.password) ||
		validator.isEmpty(req.body.gender) ||
		validator.isEmpty(req.body.contact_address)
	) {
		apiHandler.setErrorResponse('FIELD_MISSING', res, req);
	} else if (!validator.isEmail(req.body.email)) {
		apiHandler.setErrorResponse('INVALID_EMAIL', res, req);
	} else {
		let createUser = {
			name: req.body.name,
			email: req.body.email,
			gender: req.body.gender,
			contact_address: req.body.contact_address,
			contact_position: req.body.contact_position,
			password: req.body.password,
			contactName: req.body.contact_name,
			contactNumber: req.body.contact_number
		};
		model.users.getAdmin((err, adminData) => {
			if (err || adminData) {
				return apiHandler.setErrorResponse('ADMIN_EXISTS', res, req);
			} else {
				var newUser = new model.users(createUser);
				model.users.createUser(newUser, (err, user) => {
					if (err) {
						return apiHandler.setErrorResponse('UNKNOWN_ERROR', res, req);
					} else {
						model.roles.getAdminRole((err, roleData) => {
							if (err) {
								apiHandler.setErrorResponse('UNKNOWN_ERROR', res, req);
							} else {
								userToken.userId = newUser._id;
								userToken.date = Date.now();
								var token = jWT.getLoginToken(userToken);
								user.isAdmin = true; // giving the administrative role
								let roleObject = {
									roleId: roleData._id,
									role_name: roleData.name
								};
								user.roles = [ roleObject ];
								var newCounter = new model.counter();
								model.counter.createCounter(newCounter);
								user.save((err, saved) => {
									if (err) {
										apiHandler.setErrorResponse('UNKNOWN_ERROR', res, req);
									} else {
										apiHandler.setSuccessResponse(
											{ message: 'Registered Successfully', token },
											res,
											req
										);
									}
								});
							}
						});
					}
				});
			}
		});
	}
};

/**
 * Local authentication
 */
Passport.use(
	new LocalStrategy((username, password, done) => {
		model.users.getUserByEmail(username, (err, user) => {
			if (err) {
				return done(null, false, { message: 'INVALID_USER' });
			}
			if (!user) {
				return done(null, false, { message: 'EMAIL_ID_NOT_REGISTER' });
			} else if (!user.password) {
				return done(null, false, { message: 'EMAIL_ID_NOT_REGISTER' });
			} else if (user && !user.isActive.status) {
				return done(null, false, { message: 'EMAIL_ID_IS_DEACTIVATED' });
			}
			/**
	   * Check if given password is correct.
	   */
			model.users.comparePassword(password.trim(), user.password, (err, isMatch) => {
				if (err) {
					return done(null, false, { message: 'UNKNOWN_ERROR' });
				} else {
					if (isMatch) {
						return done(null, user);
					} else {
						return done(null, false, { message: 'PASSWORD_DOES_NOT_MATCH' });
					}
				}
			});
		});
	})
);

/**
 * API to login
 * @param req
 * @param res
 */
export const login = (req, res, next) => {
	var userToken = {};
	if (!validator.isEmail(req.body.username)) {
		apiHandler.setErrorResponse('INVALID_EMAIL', res, req);
	} else if (!req.body.password || validator.isEmpty(req.body.password)) {
		apiHandler.setErrorResponse('INVALID_PASSWORD', res, req);
		// } else if (!req.body.role || validator.isEmpty(req.body.role)) {
		// 	apiHandler.setErrorResponse('ROLE_NOT_FOUND', res, req);
	} else {
		Passport.authenticate('local', (err, user, info) => {
			if (!err && !user && info) {
				apiHandler.setErrorResponse(info.message, res, req);
				// } else if (user && user.roles[0].role_name != req.body.role) {
				// 	apiHandler.setErrorResponse('ROLE_UNAUTHORIZED', res, req);
			} else if (user && user.isActive.status) {
				userToken.userId = user._id;
				userToken.date = Date.now();
				let token = jWT.getLoginToken(userToken);
				console.log('login token------------', token);
				user.password = '';
				apiHandler.setSuccessResponse({ token, user, message: 'Logged In Successfully' }, res, req);
			}
		})(req, res, next);
	}
};

/**
 * Admin API to create user
 * @param req
 * @param res
 */
export const createUsers = (req, res) => {
	let selectedRole = changeCase.lowerCase(req.body.role),
		password = req.body.password.trim();
	if (!req.user.isAdmin) {
		apiHandler.setErrorResponse('NOT_ADMIN', res, req);
	} else {
		if (
			validator.isEmpty(req.body.name) ||
			validator.isEmpty(password) ||
			validator.isEmpty(req.body.gender) ||
			validator.isEmpty(req.body.contact_position) ||
			validator.isEmpty(req.body.contact_address)
		) {
			return apiHandler.setErrorResponse('FIELD_MISSING', res, req);
		} else if (!validator.isEmail(req.body.email)) {
			return apiHandler.setErrorResponse('INVALID_EMAIL', res, req);
		} else if (selectedRole !== 'operator' && selectedRole !== 'qa') {
			return apiHandler.setErrorResponse('ROLE_NOT_FOUND', res, req);
		} else {
			model.users.getUserByEmail(req.body.email, (err, userExists) => {
				if (err || userExists) {
					return apiHandler.setErrorResponse('USER_EXISTS', res, req);
				} else {
					model.users.checkPhoneDuplicacy(req.body.email, req.body.contact_number, (err, duplicate) => {
						if (err || duplicate) {
							return apiHandler.setErrorResponse('DUPLICATED_PHONE', res, req);
						} else {
							padDigitsForOperator(10).then((num) => {
								let createUser = {
									name: req.body.name,
									email: req.body.email,
									gender: req.body.gender,
									contact_address: req.body.contact_address,
									contact_position: req.body.contact_position,
									password,
									operator_id: selectedRole === 'operator' ? `OP#${num}` : `QA#${num}`,
									contactName: req.body.contact_name,
									contactNumber: req.body.contact_number
								};
								var newUser = new model.users(createUser);
								model.users.createUser(newUser, (err, user) => {
									if (err && err.code === 11000) {
										return apiHandler.setErrorResponse('DUPLICATED_PHONE', res, req);
									} else {
										model.roles.getRoleByName(selectedRole, function(err, role) {
											if (err) {
												return apiHandler.setErrorResponse('UNKNOWN_ERROR', res, req);
											} else {
												let roleObject = {
													roleId: role._id,
													role_name: role.name
												};
												user.roles = [ roleObject ];
												let verifyCode = changeCase.lowerCase(randomstring.generate(6));

												model.verification_code.getCodeDetailsByUserEmail(
													req.body.email,
													(err, codeData) => {
														if (!codeData || codeData == null) {
															let newCode = new model.verification_code({
																user_id: user,
																verificationCode: verifyCode,
																email: req.body.email
															});
															model.verification_code.createCode(newCode);
														} else {
															codeData.verificationCode = verifyCode;
															codeData.save();
														}
														user.save((err, saved) => {
															if (err) {
																return apiHandler.setErrorResponse(
																	'UNKNOWN_ERROR',
																	res,
																	req
																);
															} else {
																apiHandler.setSuccessResponse(
																	{
																		message: `${changeCase.upperCaseFirst(
																			selectedRole
																		)} created successfully`
																	},
																	res,
																	req
																);
															}
														});
													}
												);
											}
										});
									}
								});
							});
						}
					});
				}
			});
		}
	}
};

/**
 * API to create and send verfication code to the user upon click to forgot password
 * @param req
 * @param res
 */
export const forgotPassword = (req, res) => {
	let email = req.body.email.trim();
	if (!validator.isEmail(req.body.email)) {
		apiHandler.setErrorResponse('INVALID_EMAIL', res, req);
	} else {
		email = changeCase.lowerCase(email);
		model.users.getUserByEmail(email, (err, userData) => {
			if (err) {
				apiHandler.setErrorResponse('UNKNOWN_ERROR', res, req);
			} else if (!userData) {
				apiHandler.setErrorResponse('EMAIL_ID_NOT_REGISTER', res, req);
			} else {
				mailer.sendMails(userData, email, res, req);
			}
		});
	}
};

/**
 * API to reset password with the received verification code
 * @param req
 * @param res
 */
export const updatePasswordAfterForgotCode = (req, res) => {
	let code = req.body.verify_code.trim(),
		password = req.body.new_password.trim();
	if (validator.isEmpty(password)) {
		apiHandler.setErrorResponse('INVALID_PASSWORD', res, req);
	} else if (!code || validator.isEmpty(code)) {
		apiHandler.setErrorResponse('VERIFY_CODE_NOT_FOUND', res, req);
	} else {
		model.verification_code.getCodeDetailsByCode(code, (err, data) => {
			if (err) {
				apiHandler.setErrorResponse('UNKNOWN_ERROR', res, req);
			} else if (!data) {
				apiHandler.setErrorResponse('TOKEN_EXPIRED', res, req);
			} else {
				model.users.getUserById(data.user_id._id, (err, user) => {
					if (err || !user) {
						apiHandler.setErrorResponse('INVALID_USER', res, req);
					} else {
						user.password = password;
						user.save((err, success) => {
							if (err) {
								apiHandler.setErrorResponse('UNKNOWN_ERROR', res, req);
							} else {
								data.verificationCode = null;
								data.save((err, saved) => {
									if (err) {
										apiHandler.setErrorResponse('UNKNOWN_ERROR', res, req);
									} else {
										apiHandler.setSuccessResponse(
											{
												message: `Password has been reset. Use with your login details to gain access in the application.`
											},
											res,
											req
										);
									}
								});
							}
						});
					}
				});
			}
		});
	}
};

/**
 * API to change user password.
 * @param req
 * @param res
 */
export const changePassword = (req, res) => {
	let user = req.user,
		oldPassword = req.body.old_password,
		newPassword = req.body.new_password;
	if (!user) {
		apiHandler.setErrorResponse('INVALID_USER', res, req);
	} else {
		if (!oldPassword || validator.isEmpty(oldPassword) || !newPassword || validator.isEmpty(newPassword)) {
			apiHandler.setErrorResponse('FIELD_MISSING', res, req);
		} else {
			model.users.comparePassword(oldPassword, user.password, (err, isMatch) => {
				if (isMatch) {
					user.password = newPassword;
					user.save((err, saved) => {
						if (err) {
							apiHandler.setErrorResponse('UNKNOWN_ERROR', res, req);
						} else {
							apiHandler.setSuccessResponse({ message: 'Password updated' }, res, req);
						}
					});
				} else {
					apiHandler.setErrorResponse('PASSWORD_MISMATCH_ERROR', res, req);
				}
			});
		}
	}
};

/**
 * API to fetch the user profile
 * @param req
 * @param res
 */
export const fetchUser = (req, res) => {
	if (!req.user.isAdmin) {
		apiHandler.setErrorResponse('NOT_ADMIN', res, req);
	} else {
		if (!req.params.id || !validator.isMongoId(req.params.id)) {
			apiHandler.setErrorResponse('INVALID_USER', res, req);
		} else {
			model.users.getUserById(req.params.id, (err, user) => {
				if (err) {
					apiHandler.setErrorResponse('UNKNOWN_ERROR', res, req);
				} else if (!user) {
					apiHandler.setErrorResponse('INVALID_USER', res, req);
				} else {
					user.password = '';
					apiHandler.setSuccessResponse({ user: user }, res, req);
				}
			});
		}
	}
};

/**
 * API to update the user(Operator/QA) profile
 * @param req
 * @param res
 */
export const updateUser = (req, res) => {
	let findRole = _.find(req.user.roles, (data) => {
		return data.role_name === 'admin' || data.role_name === 'operator';
	});
	if (!findRole) {
		return apiHandler.setErrorResponse('ROLE_UNAUTHORIZED', res, req);
	} else {
		if (!req.params.id || !validator.isMongoId(req.params.id)) {
			return apiHandler.setErrorResponse('INVALID_USER', res, req);
		} else {
			model.users.getUserById(req.params.id, (err, user) => {
				if (err) {
					return apiHandler.setErrorResponse('UNKNOWN_ERROR', res, req);
				} else if (!user) {
					return apiHandler.setErrorResponse('INVALID_USER', res, req);
				} else {
					if (req.body.email && !validator.isEmail(req.body.email)) {
						return apiHandler.setErrorResponse('INVALID_EMAIL', res, req);
					} else if (req.body.password && !validator.isLength(req.body.password, { min: 3, max: 15 })) {
						return apiHandler.setErrorResponse('INVALID_PASSWORD', res, req);
					}
					user.email = req.body.email ? req.body.email : user.email;
					user.password = req.body.password ? req.body.password : user.password;
					user.name = req.body.name && !validator.isEmpty(req.body.name) ? req.body.name : user.name;
					user.contact_position =
						req.body.contact_position && !validator.isEmpty(req.body.contact_position)
							? req.body.contact_position
							: user.contact_position;
					user.contact_address =
						req.body.contact_address && !validator.isEmpty(req.body.contact_address)
							? req.body.contact_address
							: user.contact_address;
					user.contactNumber =
						req.body.contact_number && req.body.contact_number
							? req.body.contact_number
							: user.contactNumber;

					user.save((err, saved) => {
						if (err) {
							apiHandler.setErrorResponse('UNKNOWN_ERROR', res, req);
						} else {
							apiHandler.setSuccessResponse({ message: `User has been updated` }, res, req);
						}
					});
				}
			});
		}
	}
};

/**
 * API to delete a user profile
 * @param req
 * @param res
 */
export const deleteUser = (req, res) => {
	if (!req.user.isAdmin) {
		apiHandler.setErrorResponse('NOT_ADMIN', res, req);
	} else {
		if (!req.params.id || !validator.isMongoId(req.params.id)) {
			apiHandler.setErrorResponse('INVALID_USER', res, req);
		} else {
			model.users.getUserById(req.params.id, (err, user) => {
				if (err || !user) {
					apiHandler.setErrorResponse('INVALID_USER', res, req);
				} else {
					model.users.removeById(req.params.id, (err, done) => {
						if (err) {
							apiHandler.setErrorResponse('UNKNOWN_ERROR', res, req);
						} else {
							apiHandler.setSuccessResponse({ message: `User has been removed` }, res, req);
						}
					});
				}
			});
		}
	}
};

/**
* API to get the list of all available operators plus QAs
* @param req
* @param res
*/
export const getOperatorsAndQAs = (req, res) => {
	let findRole = _.find(req.user.roles, (data) => {
		return data.role_name === 'admin' || data.role_name === 'operator' || data.role_name === 'qa';
	});
	if (!findRole) {
		return apiHandler.setErrorResponse('ROLE_UNAUTHORIZED', res, req);
	} else {
		let limit = req.query.limit ? parseInt(req.query.limit) : 15,
			pageNo = req.query.page_no ? parseInt(req.query.page_no) - 1 : 0,
			sortBy = req.query.sortBy ? req.query.sortBy : 'createdAt',
			sort_order = req.query.sort_order ? req.query.sort_order : -1,
			sortCondition = { [sortBy]: sort_order },
			isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : 'all',
			search = req.query.search ? escapeStringRegexp(req.query.search) : '',
			finalArray = [];
		var searchCondition = {
			$or: [
				{ name: new RegExp(search, 'i') },
				{ email: new RegExp(search, 'i') },
				{ operator_id: new RegExp(search, 'i') },
				{ contactNumber: new RegExp(search, 'i') },
				{ contact_address: new RegExp(search, 'i') },
				{ contact_position: new RegExp(search, 'i') }
			]
		};
		model.users.fetchAllOperatorsCount(isActive, searchCondition, (err, operators) => {
			if (err || !operators) {
				return apiHandler.setErrorResponse('PROBLEM_FETCHING_CLIENTS', res, req);
			} else if (operators.length >= 0) {
				model.users.fetchAllOperators(
					pageNo,
					limit,
					isActive,
					sortCondition,
					searchCondition,
					(err, result) => {
						if (!err && result) {
							finalArray = result;
						}
						return apiHandler.setSuccessResponse(
							{ operators: finalArray, count: operators.length },
							res,
							req
						);
					}
				);
			} else {
				apiHandler.setSuccessResponse({ operators: finalArray, count: 0 }, res, req);
			}
		});
	}
};

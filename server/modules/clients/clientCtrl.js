import model from '../../schema';
import apiHandler from '../../../services/api-handler';
import _ from 'lodash';
import { padDigits } from '../../helpers/utils';
import constant from '../../helpers/function-constant';

/**
 * Client Initial Setup
 * @param req
 * @param res
 */
export const clientSetup = (req, res) => {
	let findRole = _.find(req.user.roles, (data) => {
		return data.role_name === 'admin' || data.role_name === 'operator';
	});
	if (!findRole) {
		return apiHandler.setErrorResponse('ROLE_UNAUTHORIZED', res, req);
	} else {
		let result = {};
		if (req.body.client_reference === '') {
			// initial doc creation
			new Promise((resolve, reject) => {
				let initialClientData = {
					last_updated: new Date()
				};
				var newClient = new model.clients(initialClientData);
				model.clients.create(newClient, (err, client) => {
					if (err) {
						reject(err);
					} else {
						result.client = client;
						resolve(client);
					}
				});
			})
				.then(() => {
					return new Promise((resolve, reject) => {
						let initialData = {
							type: 'Client',
							reference_number: result.client.reference_no,
							reference_id: result.client._id
						};
						var newRevision = new model.revision(initialData);
						model.revision.create(newRevision, (err, revisionData) => {
							if (err) {
								reject(err);
							} else {
								result.revision = revisionData;
								resolve(revisionData);
							}
						});
					});
				})
				.then(() => {
					return new Promise((resolve, reject) => {
						padDigits(10).then((num) => {
							let object = {
								created: `${result.revision.reference_number}-${result.revision.revision_number}`,
								linked: `${result.revision.reference_number}`
							};
							let genLog = `EN#${num}`;
							let initialLogData = {
								event_number: genLog,
								user_id: req.user._id,
								type: constant.FUNCTION,
								function: constant.FUNCTION_1_1,
								event_activity: `F1.1: New client ${result.revision.reference_number} created by ${req
									.user.name} at `,
								objects: object
							};
							var newLog = new model.event_logs(initialLogData);
							model.event_logs.create(newLog, (err, eventLog) => {
								if (err) {
									reject(err);
								} else {
									result.eventlog = eventLog;
									resolve(eventLog);
								}
							});
						});
					});
				})
				.then(() => {
					return new Promise((resolve, reject) => {
						model.clients.findOneAndUpdate(
							{ _id: result.client._id },
							{
								$push: {
									revisions: `${result.revision.reference_number}-${result.revision.revision_number}`
								},
								$set: {
									last_updated_id: `${result.revision.reference_number}-${result.revision
										.revision_number}`
								}
							},
							{ new: true },
							(err, updated) => {
								if (err) {
									reject(err);
								} else {
									resolve(updated);
								}
							}
						);
					});
				})
				.then(() => {
					return apiHandler.setSuccessResponse(
						{
							event_id: result.eventlog._id,
							revision_id: result.revision._id,
							client_reference: result.revision.reference_number,
							log_number: result.eventlog.event_number
						},
						res,
						req
					);
				})
				.catch((err) => {
					return apiHandler.setErrorResponse(err, res, req);
				});
		} else {
			// check for status in the REVISION collection, update the 'status' flag to 1, after updating the cda/msa etc
			new Promise((resolve, reject) => {
				model.revision
					.findOne({ reference_number: req.body.client_reference, active: constant.ACTIVE })
					.sort({ createdAt: -1 })
					.exec((err, clientDoc) => {
						if (err) {
							reject(err);
						} else {
							if (!clientDoc) {
								reject(new Error('Revision Record Not Found'));
							} else {
								result.client_revision = clientDoc;
								resolve(clientDoc);
							}
						}
					});
			})
				.then(() => {
					return new Promise((resolve, reject) => {
						model.clients.findById(result.client_revision.reference_id, (err, client) => {
							if (err) {
								reject(err);
							} else {
								result.client = client;
								resolve(client);
							}
						});
					});
				})
				.then((client) => {
					return new Promise((resolve, reject) => {
						if (result.client.qa_status === constant.PENDING) {
							reject(new Error('QA has not approved the previous details'));
						} else if (result.client.qa_status === constant.FAILED) {
							model.revision
								.findOne({
									$and: [
										{ reference_number: req.body.client_reference },
										{ 'data_qa.qa_status': constant.PASSED },
										{ active: constant.ACTIVE }
									]
								})
								.sort({ createdAt: -1 })
								.exec((err, details) => {
									if (err || !details) {
										reject(new Error('QA has not approved the previous details'));
									} else {
										result.client_revision = details;
										resolve();
									}
								});
						} else {
							resolve();
						}
					});
				})
				.then(() => {
					return new Promise((resolve, reject) => {
						let data = {
							type: result.client_revision.type,
							reference_number: result.client_revision.reference_number,
							revision_number: parseInt(result.client_revision.revision_number + 1),
							reference_id: result.client_revision.reference_id,
							data: result.client_revision.data
						};

						var newRevision = new model.revision(data);
						model.revision.create(newRevision, (err, revisionData) => {
							if (err) {
								reject(err);
							} else {
								result.revision = revisionData;
								resolve(revisionData);
							}
						});
					});
				})
				.then(() => {
					return new Promise((resolve, reject) => {
						padDigits(10).then((num) => {
							let old_no =
								result.client_revision.reference_number + '-' + result.client_revision.revision_number;
							let new_no =
								result.revision.reference_number +
								'-' +
								parseInt(result.client_revision.revision_number + 1);
							let object = {
								created: new_no,
								updated: old_no,
								linked: result.client_revision.reference_number
							};
							let genLog = `EN#${num}`;
							let initialLogData = {
								type: constant.FUNCTION,
								event_number: genLog,
								user_id: req.user._id,
								function: constant.FUNCTION_1_2,
								qa_status: constant.PENDING,
								event_activity: `F1.2: Existing client ${old_no} updated to ${new_no} by ${req.user
									.name} at `,
								objects: object
							};
							var newLog = new model.event_logs(initialLogData);
							model.event_logs.create(newLog, (err, eventLog) => {
								if (err) {
									reject(err);
								} else {
									result.eventlog = eventLog;
									resolve(eventLog);
								}
							});
						});
					});
				})
				.then(() => {
					return new Promise((resolve, reject) => {
						let update = {
							$set: {
								qa_status: constant.PENDING,
								last_updated_id: result.eventlog.objects.created
							},
							$push: { revisions: result.eventlog.objects.created }
						};
						model.clients.findOneAndUpdate({ _id: result.client._id }, update, (err, saved) => {
							if (!err) {
								resolve(saved);
							} else {
								reject(err);
							}
						});
					});
				})
				.then(() => {
					let response = {
						event_id: result.eventlog._id,
						revision_id: result.revision._id,
						client_reference: result.revision.reference_number,
						log_number: result.eventlog.event_number,
						client: result.revision
					};
					return apiHandler.setSuccessResponse(response, res, req);
				})
				.catch((err) => {
					return apiHandler.setErrorResponse(err, res, req);
				});
		}
	}
};

/**
 * Update Client Tabs
 * @param {*} req 
 * @param {*} res 
 */
export const updateClient = (req, res) => {
	let findRole = _.find(req.user.roles, (data) => {
		return data.role_name === 'admin' || data.role_name === 'operator';
	});
	if (!findRole) {
		return apiHandler.setErrorResponse('ROLE_UNAUTHORIZED', res, req);
	} else {
		let result = {};
		new Promise((resolve, reject) => {
			model.revision.findById({ _id: req.params.revision_id }, (err, details) => {
				if (err) {
					reject(err);
				} else {
					result.prevRevision = details;
					resolve(details);
				}
			});
		})
			.then(() => {
				return new Promise((resolve, reject) => {
					model.event_logs.findOneAndUpdate(
						{ _id: req.params.event_id },
						{ status: 1 },
						{ new: true },
						(err, resultData) => {
							if (err) {
								reject(err);
							} else {
								result.event_log = resultData;
								resolve(result);
							}
						}
					);
				});
			})
			.then((result) => {
				return new Promise((resolve, reject) => {
					let allData = { ...result.prevRevision.data, ...req.body.data };
					let qaData = {
						data_entry_user: req.user.name,
						data_entry_datetime: new Date(),
						data_entry_event_number: result.event_log.event_number
					};
					model.revision.findOneAndUpdate(
						{ _id: req.params.revision_id },
						{
							$set: {
								data: allData,
								data_qa: qaData,
								active: constant.ACTIVE
							}
						},
						{ new: true },
						(err, data) => {
							if (err) {
								reject(err);
							} else {
								result.revision = data;
								resolve(data);
							}
						}
					);
				});
			})
			.then(() => {
				return new Promise((resolve, reject) => {
					let last_id = result.revision.reference_number + '-' + result.revision.revision_number;
					model.clients.findOneAndUpdate(
						{ _id: result.revision.reference_id },
						{
							$set: {
								last_updated_id: last_id,
								qa_status: constant.PENDING,
								active: constant.ACTIVE
							}
						},
						{ new: true },
						(err, data) => {
							if (err) {
								reject(err);
							} else {
								result.client = data;
								resolve(data);
							}
						}
					);
				});
			})
			.then(() => {
				return apiHandler.setSuccessResponse({ message: 'Client updated successfully' }, res, req);
			})
			.catch((error) => {
				return apiHandler.setErrorResponse(error, res, req);
			});
	}
};

/**
 * Clients List 
 * @param req
 * @param res
 */
export const getClients = (req, res) => {
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
				{ reference_no: new RegExp(search, 'i') },
				{ contactNumber: new RegExp(search, 'i') },
				{ contact_address: new RegExp(search, 'i') },
				{ contact_position: new RegExp(search, 'i') }
			]
		};

		let flag = isActive ? constant.ACTIVE : constant.INACTIVE;
		if (flag !== constant.ACTIVE && flag !== constant.INACTIVE) {
			flag = 'all';
		}
		model.clients.fetchAllClientsCount(flag, searchCondition, (err, clients) => {
			if (err || !clients) {
				return apiHandler.setErrorResponse('PROBLEM_FETCHING_CLIENTS', res, req);
			} else if (clients.length >= 0) {
				model.clients.fetchAllClients(pageNo, limit, flag, sortCondition, searchCondition, (err, result) => {
					if (!err && result) {
						finalArray = result;
					}
					return apiHandler.setSuccessResponse({ clients: finalArray, count: clients.length }, res, req);
				});
			} else {
				return apiHandler.setSuccessResponse({ clients: finalArray, count: 0 }, res, req);
			}
		});
	}
};

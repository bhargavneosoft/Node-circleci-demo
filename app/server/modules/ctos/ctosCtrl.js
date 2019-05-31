import _ from 'lodash';
import apiHandler from '../../../services/api-handler';
import model from '../../schema';
import { padDigits, splitData } from '../../helpers/utils';
import constant from '../../../server/helpers/function-constant';

/**
 * Initial CTOS Setup
 * @param {*} req 
 * @param {*} res 
 */
export const ctosSetup = (req, res) => {
	let findRole = _.find(req.user.roles, (data) => {
		return data.role_name === 'admin' || data.role_name === 'operator';
	});
	if (!findRole) {
		return apiHandler.setErrorResponse('ROLE_UNAUTHORIZED', res, req);
	} else {
		let result = {};
		let data = splitData('#', req.body.ctos_reference);
		if (data[0] === 'CR') {
			//Initial CTOS creation 2.1
			new Promise((resolve, reject) => {
				model.revision
					.findOne({
						reference_number: req.body.ctos_reference
					})
					.populate('reference_id')
					.sort({ createdAt: -1 })
					.exec((err, data) => {
						if (err) {
							reject(new Error(err));
						} else {
							if (!result) {
								reject(new Error('Record Not Found'));
							} else {
								result.client = data;
								resolve(data);
							}
						}
					});
			})
				.then(() => {
					return new Promise((resolve, reject) => {
						if (result.client.reference_id.qa_status === constant.PENDING) {
							reject(new Error('QA has not approved client details.'));
						} else if (result.client.reference_id.qa_status === constant.FAILED) {
							model.revision
								.findOne({
									$and: [
										{ reference_number: req.body.ctos_reference },
										{ 'data_qa.qa_status': constant.PASSED }
									]
								})
								.sort({ createdAt: -1 })
								.exec((err, details) => {
									if (err || !details) {
										reject(new Error('QA has not approved client details.'));
									} else {
										result.client = details;
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
						let initialCTOSData = {
							last_updated: new Date(),
							client_id: result.client.reference_id
						};
						var newCtos = new model.ctos(initialCTOSData);
						model.ctos.create(newCtos, (err, ctos) => {
							if (err) {
								reject(err);
							} else {
								result.ctos = ctos;
								resolve(ctos);
							}
						});
					});
				})
				.then(() => {
					return new Promise((resolve, reject) => {
						let ctosRevisionData = {
							type: constant.CTOS,
							reference_id: result.ctos._id,
							reference_number: result.ctos.ctos_reference_no,
							client_revision_id: result.client._id
						};
						var newCTOS = new model.ctosRevisionModel(ctosRevisionData);
						model.ctosRevisionModel.create(newCTOS, (err, ctosRevisionData) => {
							if (err) {
								reject(err);
							} else {
								result.ctosRevisionData = ctosRevisionData;
								resolve(ctosRevisionData);
							}
						});
					});
				})
				.then(() => {
					return new Promise((resolve, reject) => {
						padDigits(10).then((num) => {
							let object = {
								created: `${result.ctosRevisionData.reference_number}-${result.ctosRevisionData
									.revision_number}`,
								linked: `${result.ctosRevisionData.reference_number}`
							};
							let genLog = `EN#${num}`;
							let initialLogData = {
								event_number: genLog,
								user_id: req.user._id,
								type: constant.FUNCTION,
								function: constant.FUNCTION_2_1,
								event_activity: `F2.1: New CTOS ${result.ctosRevisionData
									.reference_number} created by ${req.user.name} at `,
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
						model.ctos.findOneAndUpdate(
							{ _id: result.ctos._id },
							{
								$set: {
									last_updated_id: `${result.ctosRevisionData.reference_number}-${result
										.ctosRevisionData.revision_number}`
								},
								$push: {
									revisions: `${result.ctosRevisionData.reference_number}-${result.ctosRevisionData
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
							ctos_revision_id: result.ctosRevisionData._id,
							ctos_reference: result.ctosRevisionData.reference_number,
							log_number: result.eventlog.event_number,
							client_reference_no: req.body.ctos_reference,
							client_info: result.client.data_qa
						},
						res,
						req
					);
				})
				.catch((err) => {
					return apiHandler.setErrorResponse(err, res, req);
				});
		} else {
			// Update CTOS function 2.2 and updating the 'status' to 1
			new Promise((resolve, reject) => {
				model.ctosRevisionModel
					.findOne({ reference_number: req.body.ctos_reference, active: constant.ACTIVE })
					.sort({ createdAt: -1 })
					.exec((err, ctosDoc) => {
						if (err) {
							reject(err);
						} else {
							if (!ctosDoc) {
								reject(new Error('CTOS Revision Record Not Found'));
							} else {
								result.ctos_revision = ctosDoc;
								resolve(ctosDoc);
							}
						}
					});
			})
				.then(() => {
					return new Promise((resolve, reject) => {
						model.ctos
							.findById(result.ctos_revision.reference_id)
							.populate('client_id')
							.exec((err, ctosData) => {
								if (err) {
									reject(err);
								} else {
									result.ctosData = ctosData;
									resolve(ctosData);
								}
							});
					});
				})
				.then(() => {
					return new Promise((resolve, reject) => {
						if (result.ctosData.qa_status === constant.PENDING) {
							reject(new Error('QA has not approved the previous details'));
						} else if (result.ctosData.qa_status === constant.FAILED) {
							model.ctosRevisionModel
								.findOne({
									$and: [
										{ reference_number: req.body.ctos_reference },
										{ active: constant.ACTIVE },
										{ 'data_qa.qa_status': constant.PASSED }
									]
								})
								.sort({ createdAt: -1 })
								.exec((err, details) => {
									if (err || !details) {
										reject(new Error('QA has not approved the previous details'));
									} else {
										result.ctos_revision = details;
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
						padDigits(10).then((num) => {
							let old_no =
								result.ctos_revision.reference_number + '-' + result.ctos_revision.revision_number;
							let new_no =
								result.ctos_revision.reference_number +
								'-' +
								parseInt(result.ctos_revision.revision_number + 1);
							let object = {
								created: new_no,
								updated: old_no,
								linked: result.ctos_revision.reference_number
							};
							let genLog = `EN#${num}`;
							let initialLogData = {
								type: constant.FUNCTION,
								event_number: genLog,
								user_id: req.user._id,
								function: constant.FUNCTION_2_2,
								qa_status: constant.PENDING,
								event_activity: `F2.2: Existing ctos ${old_no} updated to ${new_no} by ${req.user
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
						let data_qa = {
							data_entry_user: req.user._id,
							data_entry_datetime: new Date(),
							data_entry_event_number: result.eventlog.event_number
						};

						let data = {
							type: result.ctos_revision.type,
							reference_number: result.ctos_revision.reference_number,
							client_revision_id: result.ctos_revision.client_revision_id,
							revision_number: parseInt(result.ctos_revision.revision_number + 1),
							reference_id: result.ctos_revision.reference_id,
							data: result.ctos_revision.data,
							data_qa: data_qa
						};

						var newCtosRevision = new model.ctosRevisionModel(data);
						model.ctosRevisionModel.create(newCtosRevision, (err, ctosRevisionData) => {
							if (err) {
								reject(err);
							} else {
								result.ctosRevisionData = ctosRevisionData;
								resolve(ctosRevisionData);
							}
						});
					});
				})
				.then(() => {
					let reference = splitData('-', result.ctosData.last_updated_id);
					let response = {
						event_id: result.eventlog._id,
						revision_id: result.ctosRevisionData._id,
						ctos_reference: result.ctosRevisionData.reference_number,
						log_number: result.eventlog.event_number,
						ctos: result.ctosRevisionData,
						client_reference_no: reference[0]
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
 * Update CTOS Tabs
 * @param req
 * @param res
 */
export const updateCtos = (req, res) => {
	let findRole = _.find(req.user.roles, (data) => {
		return data.role_name === 'admin' || data.role_name === 'operator';
	});
	if (!findRole) {
		return apiHandler.setErrorResponse('ROLE_UNAUTHORIZED', res, req);
	} else {
		let result = {};
		new Promise((resolve, reject) => {
			model.ctosRevisionModel.findById({ _id: req.params.revision_id }, (err, details) => {
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
					model.ctosRevisionModel.findOneAndUpdate(
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
					model.ctos.findOneAndUpdate(
						{ _id: result.revision.reference_id },
						{
							$set: {
								last_updated_id: last_id,
								qa_status: constant.PENDING,
								active: constant.ACTIVE
							},
							$push: { revisions: last_id }
						},
						{ new: true },
						(err, data) => {
							if (err) {
								reject(err);
							} else {
								result.ctos = data;
								resolve(data);
							}
						}
					);
				});
			})
			.then(() => {
				return apiHandler.setSuccessResponse({ message: 'CTOS updated successfully' }, res, req);
			})
			.catch((error) => {
				return apiHandler.setErrorResponse(error, res, req);
			});
	}
};

/**
 * Get CTOS List
 * @param req 
 * @param res 
 */
export const getCtos = (req, res) => {
	let findRole = _.find(req.user.roles, (data) => {
		return data.role_name === 'admin' || data.role_name === 'operator' || data.role_name === 'qa';
	});
	if (!findRole) {
		return apiHandler.setErrorResponse('ROLE_UNAUTHORIZED', res, req);
	} else {
		const id = req.body.ctos;
		if (!id) {
			return apiHandler.setErrorResponse('FIELD_MISSING', res, req);
		} else {
			model.ctos.getCTOSnumber(id, (err, data) => {
				if (err || !data) {
					return apiHandler.setErrorResponse('UNKNOWN_RECORD', res, req);
				} else {
					return apiHandler.setSuccessResponse({ CTOS: data }, res, req);
				}
			});
		}
	}
};

import validator from 'validator';
import apiHandler from '../../../services/api-handler';
import model from '../../schema';
import { padDigits, padDigitsForNCL } from '../../helpers/utils';
import constant from '../../helpers/function-constant';
import _ from 'lodash';

/**
 * Initial Create NCL
 * @param req
 * @param res
 */
export const createDefaultNCL = (req, res) => {
	let findRole = _.find(req.user.roles, (data) => {
		return data.role_name === 'admin' || data.role_name === 'operator' || data.role_name === 'qa';
	});
	if (!findRole) {
		return apiHandler.setErrorResponse('ROLE_UNAUTHORIZED', res, req);
	} else {
		let result = {};
		if (!req.body.ctos) {
			return apiHandler.setErrorResponse('INVALID_CTOS', res, req);
		} else {
			new Promise((resolve, reject) => {
				model.ctosRevisionModel
					.findOne({
						reference_number: req.body.ctos,
						active: constant.ACTIVE
					})
					.populate('reference_id')
					.sort({ createdAt: -1 })
					.exec((err, data) => {
						if (err || !data) {
							return apiHandler.setErrorResponse('INVALID_CTOS', res, req);
						} else {
							if (!result) {
								reject(new Error('Record Not Found'));
							} else {
								resolve(data);
							}
						}
					});
			})
				.then((ctos_revision) => {
					return new Promise((resolve, reject) => {
						if (ctos_revision.reference_id.qa_status === constant.PENDING) {
							reject(new Error('QA has not approved CTOS details.'));
						} else if (ctos_revision.reference_id.qa_status === constant.FAILED) {
							model.ctosRevisionModel.findOne(
								{
									reference_number: req.body.ctos,
									'data_qa.qa_status': constant.PASSED
								},
								(err, data) => {
									if (err) {
										reject(err);
									} else {
										if (!data) {
											reject(new Error('No any QA approved CTOS record found, please try again'));
										} else {
											result.ctos_revision = data;
											resolve(data);
										}
									}
								}
							);
						} else {
							result.ctos_revision = ctos_revision;
							resolve(ctos_revision);
						}
					});
				})
				.then(() => {
					return new Promise((resolve, reject) => {
						padDigitsForNCL(10).then((num) => {
							let generatedASN = `NCL#${num}`;
							let details = {
								reference_number: generatedASN,
								type: constant.NCL,
								ctos_id: result.ctos_revision.reference_id._id
							};
							var newNCL = new model.ncl_schema(details);
							model.ncl_schema.create(newNCL, (err, nclData) => {
								if (err) {
									reject(err);
								} else {
									result.nclData = nclData;
									resolve(nclData);
								}
							});
						});
					});
				})
				.then(() => {
					return new Promise((resolve, reject) => {
						padDigits(10).then((num) => {
							let object = {
								created: `${result.nclData.reference_number}`
							};
							let genLog = `EN#${num}`;
							let initialLogData = {
								event_number: genLog,
								inbound_received: constant.PENDING,
								user_id: req.user._id,
								type: constant.FUNCTION,
								function: constant.FUNCTION_5,
								event_activity: `F5: New NCL ${result.nclData.reference_number} created by ${req.user
									.name} at`,
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
					let response = {
						event_id: result.eventlog._id,
						ncl_id: result.nclData._id,
						ncl_reference: result.nclData.reference_number,
						log_number: result.eventlog.event_number,
						ctos_reference: req.body.ctos,
						ctos: {
							version_no: result.ctos_revision.revision_no,
							client_name: result.ctos_revision.data.client_name,
							study_number: result.ctos_revision.data.study_number,
							is_contract_executed: result.ctos_revision.data.is_contract_executed,
							product_desc: result.ctos_revision.data.product_info.product_description,
							secondary_labeling_requirenment:
								result.ctos_revision.data.outbound.secondary_labeling_requirement,
							specific_labeling_requirement:
								result.ctos_revision.data.outbound.specific_labeling_requirement,
							is_specific_labeling_anticipated:
								result.ctos_revision.data.destruction.secondary_labeling.is_activity_anticipated,
							anticipated_type_secondary_labeling:
								result.ctos_revision.data.destruction.secondary_labeling.anticipated_type_of_labeling,
							specific_instruction: result.ctos_revision.data.destruction.specific_instruction,
							default_quarantine_status:
								result.ctos_revision.data.destruction.secondary_labeling.default_quarantine,
							required_documents:
								result.ctos_revision.data.destruction.secondary_labeling.required_documents,
							supervisor_comments: result.ctos_revision.data.supervisor_comments
						},
						ctos_id: result.ctos_revision.reference_id._id
					};
					return apiHandler.setSuccessResponse(response, res, req);
				})
				.catch((err) => {
					return apiHandler.setErrorResponse(err, res, req);
				});
		}
	}
};

export const updateNCL = (req, res) => {
	let findRole = _.find(req.user.roles, (data) => {
		return data.role_name === 'admin' || data.role_name === 'operator';
	});
	if (!findRole) {
		return apiHandler.setErrorResponse('ROLE_UNAUTHORIZED', res, req);
	} else {
		let result = {};
		new Promise((resolve, reject) => {
			model.ncl_schema.findById(req.params.ncl_id, (err, details) => {
				if (err) {
					reject(err);
				} else {
					result.ncl_details = details;
					resolve(details);
				}
			});
		}).then(() => {
			return new Promise((resolve, reject) => {
				if (!result.ncl_details) {
					reject(new Error('NCL record not found.'));
				} else {
					model.event_logs.findOneAndUpdate(
						{ _id: req.params.event_id },
						{
							status: 1,
							event_activity: `F5: New NCL ${result.ncl_details.reference_number} for IR ${req.body
								.ir_reference} created by ${req.user.name} at `
						},
						{ new: true },
						(err, details) => {
							if (err) {
								reject(err);
							} else {
								result.event_log = details;
								resolve(details);
							}
						}
					);
				}
			})
				.then(() => {
					return new Promise((resolve, reject) => {
						let allData = { ...result.ncl_details.data, ...req.body.data };
						let qaData = {
							data_entry_user: req.user._id,
							data_entry_datetime: new Date(),
							data_entry_event_number: result.event_log.event_number
						};
						let object = {
							ir: req.body.ir_reference
						};
						model.ncl_schema.findOneAndUpdate(
							{ _id: req.params.ncl_id },
							{
								$set: {
									data: allData,
									data_qa: qaData,
									ctos_id: req.body.ctos_id,
									ir_id: req.body.ir_id,
									active: constant.ACTIVE,
									objects: object
								}
							},
							{ new: true },
							(err, data) => {
								if (err) {
									reject(err);
								} else {
									result.ncl_details = data;
									resolve(data);
								}
							}
						);
					});
				})
				.then(() => {
					return new Promise((resolve, reject) => {
						model.inboundReceipt.findOne({ reference_number: req.body.ir_reference }, (err, irData) => {
							if (!err) {
								irData.objects.ncl = result.ncl_details.reference_number;
								irData.objects.ctos = req.body.ctos_reference;
								irData.save().then(() => {
									resolve();
								});
							}
						});
					});
				})
				.then(() => {
					return apiHandler.setSuccessResponse({ message: 'NCL updated successfully' }, res, req);
				})
				.catch((error) => {
					return apiHandler.setErrorResponse(error, res, req);
				});
		});
	}
};

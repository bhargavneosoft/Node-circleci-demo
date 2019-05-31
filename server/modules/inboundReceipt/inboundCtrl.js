import apiHandler from '../../../services/api-handler';
import _ from 'lodash';
import model from '../../schema';
import { padDigitsForIR, padDigits, padDigitsForBoxNumber, splitData } from '../../helpers/utils';
import constant from '../../../server/helpers/function-constant';
import flagConstant from '../../../server/helpers/process_flag';

/**
 * Create Initial Inbound
 * @param {*} req 
 * @param {*} res 
 */
export const initial_4_1 = (req, res) => {
    let result = {};
    new Promise((resolve, reject) => {
        if (req.body.asn_id) {
            model.asns.findOne(
                {
                    reference_number: req.body.asn_id
                },
                (err, asndata) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (asndata) {
                            result.asn = asndata;
                            resolve(asndata);
                        } else {
                            reject(new Error('ASN record not found'));
                        }
                    }
                }
            );
        } else {
            model.ctosRevisionModel.findOne({
                reference_number: req.body.ctos_id
            })
                .sort({ createdAt: -1 })
                .exec((err, ctosRevision) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (!ctosRevision) {
                            reject(new Error('CTOS record not found'));
                        } else {
                            if (ctosRevision.data_qa.qa_status === constant.PENDING) {
                                reject(new Error('CTOS record not found either QA is not approved CTOS details'));
                            } else if (ctosRevision.data_qa.qa_status === constant.FAILED) {
                                model.ctosRevisionModel.findOne({
                                    reference_number: ctosRevision.reference_number,
                                    "data_qa.qa_status": constant.PASSED
                                }, (err, data) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        if (!data) {
                                            reject(new Error('No any QA approved CTOS record found, please try again'))
                                        } else {
                                            result.ctos = data
                                            resolve(data);
                                        }
                                    }
                                })
                            } else {
                                result.ctos = data
                                resolve(ctosRevision);
                            }
                        }
                    }
                });
        }
    })
        .then(() => {
            return new Promise((resolve, reject) => {
                padDigitsForIR(10).then((success) => {
                    result.IR_number = `IR#${success}`;
                    resolve(success);
                });
            });
        })
        .then(() => {
            return new Promise((resolve, reject) => {
                padDigitsForBoxNumber(10).then((success) => {
                    result.outerbox_reference = `BOX#${success}`;
                    resolve(success);
                });
            });
        })
        .then(() => {
            return new Promise((resolve, reject) => {
                if (result.asn) {
                    let function_3_1_data = {
                        asn: result.asn.reference_number
                    };
                    let IRData = {
                        type: constant.IR,
                        reference_number: result.IR_number,
                        data_4_1: function_3_1_data
                    };
                    var CtosIRData = new model.inboundReceipt(IRData);
                    model.inboundReceipt.create(CtosIRData, (err, CtosIR) => {
                        if (err) {
                            reject(err);
                        } else {
                            CtosIR.objects.asn.push(result.asn.reference_number);
                            CtosIR.save((err, saved) => {
                                if (!err) {
                                    result.inboundReceipt = CtosIR;
                                    resolve(CtosIR);
                                }
                            });
                        }
                    });
                } else {
                    let IRData = {
                        type: constant.IR,
                        reference_number: result.IR_number,
                        objects: { ctos: result.ctos._id }
                    };
                    var CtosIRData = new model.inboundReceipt(IRData);
                    model.inboundReceipt.create(CtosIRData);
                    result.inboundReceipt = CtosIRData;
                    resolve({});
                }
            });
        })
        .then(() => {
            return new Promise(function (resolve, reject) {
                padDigits(10).then((num) => {
                    let genLog = `EN#${num}`;
                    let object = {
                        created: `${result.IR_number}`
                    };
                    let activity = {
                        type: constant.FUNCTION,
                        event_number: genLog,
                        user_id: req.user._id,
                        function: constant.FUNCTION_4_1,
                        event_activity: `New IR ${result.IR_number} created by ${req.user.name} at `,
                        qa_status: constant.PENDING,
                        objects: object
                    };
                    var newLog = new model.event_logs(activity);
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
                inbound_id: result.inboundReceipt._id,
                asn_reference: result.IR_number,
                log_number: result.eventlog.event_number,
                ctos: result.ctos
            };
            return apiHandler.setSuccessResponse(response, res, req);
        })
        .catch((error) => {
            return apiHandler.setErrorResponse(error, res, req);
        });
};

/**
 * Update Inbound
 * @param {*} req 
 * @param {*} res 
 */
export const update_4_1 = (req, res) => {
	let findRole = _.find(req.user.roles, (data) => {
		return data.role_name === 'admin' || data.role_name === 'operator' || data.role_name === 'qa';
	});
	if (!findRole) {
		return apiHandler.setErrorResponse('ROLE_UNAUTHORIZED', res, req);
	} else {
		let result = {};
		new Promise((resolve, reject) => {
			model.inboundReceipt.findById(req.params.ir_id, (err, irData) => {
				if (err || !irData) {
					reject(new Error('Inbound record not found.'));
				} else {
					let asn_no = irData.data_4_1.asn;
					result.IR = irData;
					result.asn_no = asn_no;
					resolve(irData);
				}
			});
		})
			.then(() => {
				return new Promise((resolve, reject) => {
					model.event_logs.findOneAndUpdate(
						{ _id: req.params.event_id },
						{ status: 1 },
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
				});
			})
			.then(() => {
				return new Promise((resolve, reject) => {
					let number_of_ir_labels = parseInt(req.body.data_4_1.outerbox_number) + 1;

					let allData = { ...result.IR.data_4_1, ...req.body.data_4_1, number_of_ir_labels };

					model.inboundReceipt.findOneAndUpdate(
						{ _id: req.params.ir_id },
						{
							$set: {
								data_4_1: allData,
								active: constant.ACTIVE
							}
						},
						{ new: true },
						(err, data) => {
							if (err) {
								reject(err);
							} else {
								let data_qa = {
									data_entry_user: req.user._id,
									data_entry_datetime: new Date(),
									data_entry_event_number: result.event_log.event_number
								};
								data.data_4_1.data_qa = data_qa;

								let boxes = [],
									obj = {};

								for (let i = 1; i <= parseInt(req.body.data_4_1.outerbox_number); i++) {
									boxes.push(
										result.IR.reference_number +
											'-' +
											i +
											'/' +
											parseInt(req.body.data_4_1.outerbox_number)
									);
								}
								boxes.map((box) => {
									obj[box] = '';
								});
								data.data_4_1.outer_boxes = obj;
								let finalArray = [],
									unique = [];

								if (req.body.data_4_1.asn) {
									req.body.data_4_1.asn.map((item) => {
										finalArray.push(item);
									});
								}

								unique = [ ...new Set([ ...finalArray, ...data.objects.asn ]) ];

								data.objects.asn = unique;

								data.save((err, saved) => {
									if (!err) {
										result.ir_details = data;
										resolve(data);
									}
								});
							}
						}
					);
				});
			})
			.then((data) => {
				let x = result.asn_no;
				model.inboundReceipt.findOneAndUpdate(
					{ _id: req.params.ir_id },
					{
						$set: {
							data_4_1: {
								...data.data_4_1,
								asn: x
							}
						}
					},
					{ new: true },
					(err, data) => {
						if (!err) {
							return apiHandler.setSuccessResponse(
								{ message: 'Function 4.1 updated successfully' },
								res,
								req
							);
						}
					}
				);
			})
			.catch((error) => {
				return apiHandler.setErrorResponse(error, res, req);
			});
	}
};

/**
 * Initial Function 4.2
 * @param {*} req 
 * @param {*} res 
 */
export const initial4_2 = (req, res) => {
	let result = {};
	new Promise(async (resolve, reject) => {
		await model.inboundReceipt
			.findOne(
				{
					reference_number: req.body.reference_number
				},
				(err, data) => {
					if (err) {
						reject(err);
					} else {
						if (!data) {
							reject(new Error('Inbound record not found'));
						} else {
							result.inbound = data;
							resolve(data);
						}
					}
				}
			)
			.then((inbound) => {
				return new Promise((resolve, reject) => {
					if (inbound.data_4_1.data_qa.qa_status === constant.PENDING) {
						reject(new Error('QA has not approved the inbound details'));
					} else if (
						inbound.data_4_1.flags.process_flag_1.flag_id !== flagConstant.Pending_Evaluate_Relocate &&
						inbound.data_4_1.flags.process_flag_2.flag_id !== flagConstant.Pending_Evaluate_Relocate
					) {
						reject(new Error('Process flag inbound audit is pending.'));
					} else {
						padDigits(10).then((num) => {
							let genLog = `EN#${num}`;
							let object = {
								created: `${req.body.reference_number}`
							};
							let activity = {
								type: constant.FUNCTION,
								event_number: genLog,
								user_id: req.user._id,
								function: constant.FUNCTION_4_2,
								event_activity: `Function 4.2 Linked with ${req.body.reference_number} created by ${req
									.user.name} at `,
								qa_status: constant.PENDING,
								objects: object
							};
							var newLog = new model.event_logs(activity);
							model.event_logs.create(newLog, (err, eventLog) => {
								if (err) {
									reject(err);
								} else {
									result.eventlog = eventLog;
									resolve(eventLog);
								}
							});
						});
					}
				});
			})
			.then(() => {
				let response = {
					event_id: result.eventlog._id,
					inbound_id: result.inbound._id,
					asn_reference: req.body.reference_number,
					log_number: result.eventlog.event_number,
					inbound: result.inbound
				};
				return apiHandler.setSuccessResponse(response, res, req);
			})
			.catch((error) => {
				return apiHandler.setErrorResponse(error, res, req);
			});
	});
};

/**
 * Update Function 4.2
 * @param {*} req 
 * @param {*} res 
 */
export const update4_2 = (req, res) => {
	let result = {};
	new Promise(async (resolve, reject) => {
		await model.inboundReceipt
			.findById(req.params.ir_id, (err, data) => {
				if (err) {
					reject(err);
				} else {
					if (!data) {
						reject(new Error('Inbound record not found'));
					} else {
						result.inbound = data;
						resolve(data);
					}
				}
			})
			.then(() => {
				return new Promise(async (resolve, reject) => {
					let object = {
						created: `${result.inbound.reference_number}`
					};
					await model.event_logs.findOneAndUpdate(
						{ _id: req.params.event_id },
						{
							$set: {
								objects: object,
								event_activity: `Function 4.2 Linked with ${result.inbound
									.reference_number} created by ${req.user.name} at `,
								status: 1
							}
						},
						{ new: true },
						(err, data) => {
							if (err) {
								reject(err);
							} else {
								result.event_log = data;
								resolve(data);
							}
						}
					);
				});
			})
			.then(() => {
				return new Promise(async (resolve, reject) => {
					let data = req.body.data_4_2;
					let qadata = {
						data_entry_user: req.user._id,
						data_entry_datetime: new Date(),
						data_entry_event_number: result.event_log.event_number
					};
					data.data_qa = qadata;
					await model.inboundReceipt.findOneAndUpdate(
						{ _id: req.params.ir_id },
						{ $set: { data_4_2: data } },
						{ new: true },
						(err, data) => {
							if (err) {
								reject(err);
							} else {
								result.inbound = data;
								resolve(data);
							}
						}
					);
				});
			})
			.then(() => {
				return apiHandler.setSuccessResponse({ message: 'Function 4.2 updated successfully' }, res, req);
			})
			.catch((error) => {
				return apiHandler.setErrorResponse(error, res, req);
			});
	});
};

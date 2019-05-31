import apiHandler from '../../../services/api-handler';
import _ from 'lodash';
import model from '../../schema';
import { padDigits, padDigitsForASN } from '../../helpers/utils';
import constant from '../../helpers/function-constant';
import functionConstant from '../../helpers/function-constant';

/**
 * Initial ASN Create
 * @param {*} req 
 * @param {*} res 
 */
export const createDefaultASN = (req, res) => {
    let findRole = _.find(req.user.roles, (data) => {
        return data.role_name === 'admin' || data.role_name === 'operator';
    });
    if (!findRole) {
        return apiHandler.setErrorResponse('ROLE_UNAUTHORIZED', res, req);
    } else {
        let result = {};
        if (req.body.ctos_id) {
            new Promise((resolve, reject) => {
                model.ctosRevisionModel
                    .findOne({
                        reference_number: req.body.ctos_id,
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
                                result.ctos_revision = data;
                                resolve(data);
                            }
                        }
                    });
            })
                .then(() => {
                    return new Promise((resolve, reject) => {
                        if (result.ctos_revision.reference_id.qa_status !== constant.PASSED) {
                            reject(new Error('QA has not approved CTOS details.'));
                        } else {
                            padDigitsForASN(10).then((num) => {
                                let generatedASN = `ASN#${num}`;
                                let details = {
                                    reference_number: generatedASN,
                                    type: constant.ASN
                                };
                                var newASN = new model.asns(details);
                                model.asns.create(newASN, (err, asnData) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        result.asn = asnData;
                                        resolve(asnData);
                                    }
                                });
                            });
                        }
                    });
                })
                .then(() => {
                    return new Promise((resolve, reject) => {
                        padDigits(10).then((num) => {
                            let object = {
                                created: `${result.asn.reference_number}`
                            };

                            let genLog = `EN#${num}`;
                            let initialLogData = {
                                event_number: genLog,
                                inbound_received: constant.PENDING,
                                user_id: req.user._id,
                                type: constant.FUNCTION,
                                function: constant.FUNCTION_3,
                                event_activity: `F3: New ASN ${result.asn.reference_number} created by ${req.user
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
                    let response = {
                        event_id: result.eventlog._id,
                        asn_id: result.asn._id,
                        asn_reference: result.asn.reference_number,
                        log_number: result.eventlog.event_number,
                        ctos: req.body.ctos_id
                    };
                    return apiHandler.setSuccessResponse(response, res, req);
                })
                .catch((err) => {
                    return apiHandler.setErrorResponse(err, res, req);
                });
        } else {
            return apiHandler.setErrorResponse('INVALID_CTOS', res, req);
        }
    }
};

/**
 * Update ASN
 * @param req
 * @param res
 */
export const updateASN = (req, res) => {
    let findRole = _.find(req.user.roles, (data) => {
        return data.role_name === 'admin' || data.role_name === 'operator';
    });
    if (!findRole) {
        return apiHandler.setErrorResponse('ROLE_UNAUTHORIZED', res, req);
    } else {
        let result = {};
        new Promise((resolve, reject) => {
            model.asns.findById(req.params.asn_id, (err, details) => {
                if (err) {
                    reject(err);
                } else {
                    result.asn_details = details;
                    resolve(details);
                }
            });
        })
            .then(() => {
                return new Promise((resolve, reject) => {
                    if (!result.asn_details) {
                        reject(new Error('ASN record not found.'));
                    } else {
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
                    }
                });
            })
            .then(() => {
                return new Promise((resolve, reject) => {
                    let allData = { ...result.asn_details.data, ...req.body.data };
                    let qaData = {
                        data_entry_user: req.user.name,
                        data_entry_datetime: new Date(),
                        data_entry_event_number: result.event_log.event_number
                    };
                    model.asns.findOneAndUpdate(
                        { _id: req.params.asn_id },
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
                                result.asn_details = data;
                                resolve(data);
                            }
                        }
                    );
                });
            })
            .then(() => {
                return apiHandler.setSuccessResponse({ message: 'ASN updated successfully' }, res, req);
            })
            .catch((error) => {
                return apiHandler.setErrorResponse(error, res, req);
            });
    }
};

/**
 * Change Inbound Status API
 * @param {*} req 
 * @param {*} res 
 */
export const inboundStatusChange = (req, res) => {
    let result = {};
    new Promise(async (resolve, reject) => {
        await model.asns.findById(req.params.asn_id, (err, data) => {
            if (err) {
                reject(err);
            } else {
                result.asn = data;
                resolve(data);
            }
        })
    })
        .then(asn => {
            return new Promise(async (resolve, reject) => {
                if (!asn) {
                    reject(new Error('ASN Record Not Found'));
                } else if (asn.inbound_received === functionConstant.CONFIRMED) {
                    reject(new Error('Inbound already confirmed'));
                } else {
                    result.asn.data_qa.inbound_received_user = req.user._id;
                    result.asn.data_qa.inbound_received_datetime = req.body.inbound_received_datetime
                    console.log('data', result);
                    await model.asns.findOneAndUpdate({
                        _id: asn._id
                    }, {
                            $set: {
                                inbound_received: functionConstant.CONFIRMED,
                                data_qa: result.asn.data_qa
                            }
                        }, { new: true }, (err, data) => {
                            if (err) {
                                reject(err);
                            } else {
                                result.asn = data;
                                resolve(data)
                            }
                        })
                }
            })
        })
        .then(() => {
            return apiHandler.setSuccessResponse({ message: 'ASN inbound updated successfully' }, res, req);
        })
        .catch(error => {
            return apiHandler.setErrorResponse(error, res, req);
        })
}
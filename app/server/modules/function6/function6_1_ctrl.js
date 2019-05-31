import apiHandler from '../../../services/api-handler';
import model from '../../schema';
import constant from '../../helpers/function-constant';
import { padDigits } from '../../helpers/utils';

/**
 * Initial Create function 6.1
 * @param {*} req 
 * @param {*} res 
 */
export const initial_6_1 = (req, res) => {
    let result = {};
    new Promise(async (resolve, reject) => {
        await model.ctosRevisionModel.findOne(
            {
                reference_number: req.body.ctos_reference,
                active: constant.ACTIVE
            },
            (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    if (!data) {
                        reject(new Error('CTOS record not found.'));
                    } else {
                        resolve(data);
                    }
                }
            }
        );
    })
        .then(ctos => {
            return new Promise(async (resolve, reject) => {
                if (ctos.data_qa.qa_status === constant.PENDING) {
                    reject(new Error('QA has not approved CTOS details.'));
                } else if (ctos.data_qa.qa_status === constant.FAILED) {
                    model.ctosRevisionModel.findOne({
                        reference_number: ctos.reference_number,
                        "data_qa.qa_status": constant.PASSED
                    }, (err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            if (!data) {
                                reject(new Error('No any QA approved CTOS record found, please try again'))
                            } else {
                                result.ctos = data;
                                resolve(data);
                            }
                        }
                    })
                } else {
                    result.ctos = ctos;
                    resolve(ctos);
                }
            });
        })
        .then(() => {
            return new Promise(async (resolve, reject) => {
                await padDigits(10).then((num) => {
                    let object = {};
                    let genLog = `EN#${num}`;
                    let initialLogData = {
                        event_number: genLog,
                        user_id: req.user._id,
                        type: constant.FUNCTION,
                        function: constant.FUNCTION_6_1,
                        objects: object
                    };
                    resolve(initialLogData);
                });
            });
        })
        .then(logData => {
            return new Promise(async (resolve, reject) => {
                var newLog = new model.event_logs(logData);
                await model.event_logs.create(newLog, (err, eventLog) => {
                    if (err) {
                        reject(err);
                    } else {
                        result.eventlog = eventLog;
                        resolve(eventLog);
                    }
                });
            })
        })
        .then(() => {
            let function6data = {
                ctos_id: result.ctos._id,
                data_qa: {
                    data_entry_user: req.user.name,
                    data_entry_datetime: new Date(),
                    data_entry_event_number: result.eventlog.event_number
                }
            };
            return new Promise(async (resolve, reject) => {
                var newFunction6data = new model.function6_1(function6data);
                await model.function6_1.create(newFunction6data, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        result.funciton6_1 = data;
                        resolve(data);
                    }
                });
            });
        })
        .then(() => {
            return new Promise(async (resolve, reject) => {
                await model.event_logs.findByIdAndUpdate(
                    {
                        _id: result.eventlog._id
                    },
                    {
                        $set: {
                            event_activity: `F6.1: Linked CTOS  ${result.ctos.reference_number} created by ${req.user
                                .name} at `,
                            objects: {
                                created: result.funciton6_1._id,
                                linked: `${result.ctos.reference_number}`
                            }
                        }
                    },
                    { new: true },
                    (err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            result.eventlog = data;
                            resolve(data);
                        }
                    }
                );
            });
        })
        .then(() => {
            let response = {
                event_id: result.eventlog._id,
                function6_1_id: result.funciton6_1._id,
                ctos_reference: req.body.ctos_reference,
                log_number: result.eventlog.event_number,
                ctos: result.ctos
            };
            return apiHandler.setSuccessResponse(response, res, req);
        })
        .catch((error) => {
            apiHandler.setErrorResponse(error, res, req);
        });
};

/**
 * Update function 6.1
 * @param {*} req 
 * @param {*} res 
 */
export const update_6_1 = (req, res) => {
    let result = {};
    new Promise(async (resolve, reject) => {
        await model.function6_1.findByIdAndUpdate(
            {
                _id: req.params.function6_id
            },
            {
                $set: {
                    ctos_id: req.body.ctos_id,
                    operator_comments: req.body.operator_comments,
                    supervisor_comment: req.body.supervisor_comment,
                    CIR_reference: req.body.CIR_reference,
                    status: 1
                }
            },
            { new: true },
            (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    result.funciton6_1 = data;
                    resolve(data);
                }
            }
        );
    })
        .then(() => {
            return new Promise(async (resolve, reject) => {
                await model.event_logs.findByIdAndUpdate(
                    {
                        _id: req.params.event_id
                    },
                    {
                        $set: {
                            event_activity: `F6.1: Linked CTOS  ${req.body.ctos_reference_number} created by ${req.user
                                .name} at `,
                            objects: {
                                created: result.funciton6_1._id,
                                linked: `${req.body.ctos_reference_number}`
                            },
                            status: 1
                        }
                    },
                    { new: true },
                    (err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            result.eventlog = data;
                            resolve(data);
                        }
                    }
                );
            });
        })
        .then(() => {
            return apiHandler.setSuccessResponse({ message: 'Function 6.1 updated successfully' }, res, req);
        })
        .catch((error) => {
            apiHandler.setErrorResponse(error, res, req);
        });
};

/**
 * Initial Function 6.2
 * @param {*} req 
 * @param {*} res 
 */
export const initial_6_2 = (req, res) => {
    let result = {};
    new Promise(async (resolve, reject) => {
        await model.ctosRevisionModel.findOne({
            reference_number: req.body.ctos_reference,
            active: constant.ACTIVE
        })
            .sort({ createdAt: -1 })
            .exec((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    if (!data) {
                        reject(new Error('CTOS record not found.'));
                    } else {
                        result.ctos = data;
                        resolve(data);
                    }
                }
            });
    })
        .then(ctos => {
            return new Promise(async (resolve, reject) => {
                if (ctos.data_qa.qa_status === constant.PENDING) {
                    reject(new Error('QA has not approved CTOS details.'));
                } else if (ctos.data_qa.qa_status === constant.FAILED) {
                    model.ctosRevisionModel.findOne({
                        reference_number: ctos.reference_number,
                        "data_qa.qa_status": constant.PASSED
                    }, (err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            if (!data) {
                                reject(new Error('No any QA approved CTOS record found, please try again'))
                            } else {
                                result.ctos = data;
                                resolve(data);
                            }
                        }
                    })
                } else {
                    result.ctos = ctos;
                    resolve(ctos);
                }
            });
        })
        .then(() => {
            return new Promise(async (resolve, reject) => {
                await padDigits(10).then((num) => {
                    let object = {};
                    let genLog = `EN#${num}`;
                    let initialLogData = {
                        event_number: genLog,
                        user_id: req.user._id,
                        type: constant.FUNCTION,
                        function: constant.FUNCTION_6_2,
                        objects: object
                    };
                    resolve(initialLogData);
                });
            });
        })
        .then(logData => {
            return new Promise(async (resolve, reject) => {
                var newLog = new model.event_logs(logData);
                await model.event_logs.create(newLog, (err, eventLog) => {
                    if (err) {
                        reject(err);
                    } else {
                        result.eventlog = eventLog;
                        resolve(eventLog);
                    }
                });
            })
        })
        .then(() => {
            let function6data = {
                ctos_id: result.ctos._id,
                data_qa: {
                    data_entry_user: req.user.name,
                    data_entry_datetime: new Date(),
                    data_entry_event_number: result.eventlog.event_number
                }
            };
            return new Promise(async (resolve, reject) => {
                var newFunction6data = new model.function6_1(function6data);
                await model.function6_2.create(newFunction6data, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        result.funciton6_2 = data;
                        resolve(data);
                    }
                });
            });
        })
        .then(() => {
            return new Promise(async (resolve, reject) => {
                await model.event_logs.findByIdAndUpdate({
                    _id: result.eventlog._id
                }, {
                        $set: {
                            event_activity: `F6.2: Linked CTOS  ${result.ctos.reference_number} created by ${req.user
                                .name} at `,
                            objects: {
                                created: result.funciton6_2._id,
                                linked: `${result.ctos.reference_number}`
                            }
                        }
                    }, { new: true }, (err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            result.eventlog = data;
                            resolve(data);
                        }
                    }
                );
            });
        })
        .then(() => {
            let response = {
                event_id: result.eventlog._id,
                function6_2_id: result.funciton6_2._id,
                ctos_reference: req.body.ctos_reference,
                log_number: result.eventlog.event_number,
                ctos: result.ctos
            };
            return apiHandler.setSuccessResponse(response, res, req);
        })
        .catch((error) => {
            apiHandler.setErrorResponse(error, res, req);
        });
}

/**
 * Update Function 6.2
 * @param {*} req 
 * @param {*} res 
 */
export const update_6_2 = (req, res) => {
    let result = {};
    new Promise(async (resolve, reject) => {
        await model.function6_2.findById(req.params.function6_id, (err, data) => {
            if (err) {
                reject(err);
            } else {
                if (!data) {
                    reject(new Error('Function 6.2 Record Not Found.'))
                } else {
                    result.function6_2 = data;
                    resolve(data);
                }
            }
        })
    })
        .then(function6_2 => {
            return new Promise(async (resolve, reject) => {
                let data = req.body;
                data.ctos_id = req.body.ctos_id;
                data.data_qa = function6_2.data_qa;
                data.status = 1;

                await model.function6_2.findByIdAndUpdate({
                    _id: function6_2._id
                }, { $set: data }, { new: true }, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        result.funciton6_2 = data;
                        resolve(data);
                    }
                }
                );
            })
        })
        .then(() => {
            return new Promise(async (resolve, reject) => {
                await model.event_logs.findByIdAndUpdate({
                    _id: req.params.event_id
                }, {
                        $set: {
                            event_activity: `F6.2: Linked CTOS  ${req.body.ctos_reference_number} created by ${req.user
                                .name} at `,
                            objects: {
                                created: result.funciton6_2._id,
                                linked: `${req.body.ctos_reference_number}`
                            },
                            status: 1
                        }
                    }, { new: true }, (err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            result.eventlog = data;
                            resolve(data);
                        }
                    });
            });
        })
        .then(() => {
            return apiHandler.setSuccessResponse({ message: 'Function 6.2 updated successfully' }, res, req);
        })
        .catch((error) => {
            apiHandler.setErrorResponse(error, res, req);
        });
}

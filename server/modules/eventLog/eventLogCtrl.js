import model from '../../schema';
import apiHandler from '../../../services/api-handler';
import { splitData, padDigits } from '../../helpers/utils';
import functions from '../../helpers/function-constant';
import _ from 'lodash';

/**
 * Fetch All Event Logs
 * @param {*} req 
 * @param {*} res 
 */
export const eventLogList = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 15,
        pageNo = req.query.page_no ? parseInt(req.query.page_no) - 1 : 0,
        sortBy = req.query.sortBy ? req.query.sortBy : 'createdAt',
        sort_order = req.query.sort_order ? req.query.sort_order : -1,
        sortCondition = { [sortBy]: sort_order };

    let result = {};
    let condition;
    if (req.query.type == 'All') {
        condition = { status: 1 };
    } else {
        condition = {
            qa_status: req.query.type,
            type: functions.FUNCTION,
            status: 1,
            function: { $ne: functions.FUNCTION_3 }
        };
    }
    new Promise((resolve, reject) => {
        model.event_logs.find(condition).exec((err, data) => {
            if (err) {
                reject(new Error(err));
            } else {
                result.count = data.length;
                resolve(data);
            }
        });
    })
        .then(() => {
            return model.event_logs
                .find(condition)
                .populate({ path: 'user_id', select: 'name' })
                .sort(sortCondition)
                .skip(pageNo * limit)
                .limit(limit);
        })
        .then((events) => {
            const { count } = result;
            return apiHandler.setSuccessResponse({ events, count }, res, req);
        })
        .catch((error) => {
            return apiHandler.setErrorResponse(error, res, req);
        });
};

/**
 * Fetch Event Log Data Along With Function Data
 * @param {*} req 
 * @param {*} res 
 */
export const getEventLogData = (req, res) => {
    const isLog = req.params.log;
    const eventLogId = req.params.id;
    const result = {};

    /*  Client Data */
    const clientData = async (object, event, newEvent) => {
        return new Promise(async (resolve, reject) => {
            await model.revision.findOne(
                {
                    reference_number: object.reference_number,
                    revision_number: object.revision_number
                },
                (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        result.function = data;
                        resolve(data);
                    }
                }
            );
        })
            .then(() => {
                let response = {
                    function: result.function,
                    event: event,
                    new_event: newEvent,
                    function_type: object.function
                };
                return apiHandler.setSuccessResponse(response, res, req);
            })
            .catch((err) => {
                return apiHandler.setErrorResponse(err, res, req);
            });
    };

    /*  CTOS Data   */
    const ctosData = async (object, event, newEvent) => {
        return new Promise(async (resolve, reject) => {
            await model.ctosRevisionModel
                .findOne({
                    reference_number: object.reference_number,
                    revision_number: object.revision_number
                })
                .exec((err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        result.function = data;
                        resolve(data);
                    }
                });
        })
            .then(() => {
                return new Promise(async (resolve, reject) => {
                    await model.revision.findById(result.function.client_revision_id, (err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            result.client = data;
                            resolve(data);
                        }
                    });
                });
            })
            .then(() => {
                let response = {
                    function: result.function,
                    event: event,
                    new_event: newEvent,
                    function_type: object.function,
                    client_info: result.client.data_qa
                };
                return apiHandler.setSuccessResponse(response, res, req);
            })
            .catch((err) => {
                return apiHandler.setErrorResponse(err, res, req);
            });
    };

    /*  ASN Data  */
    const asnData = async (object, event, newEvent) => {
        return new Promise(async (resolve, reject) => {
            await model.asns.findOne(
                {
                    reference_number: object.reference_number
                },
                (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        result.function = data;
                        resolve(data);
                    }
                }
            );
        })
            .then(() => {
                let response = {
                    function: result.function,
                    event: event,
                    new_event: newEvent,
                    function_type: object.function
                };
                return apiHandler.setSuccessResponse(response, res, req);
            })
            .catch((err) => {
                return apiHandler.setErrorResponse(err, res, req);
            });
    };

    /*  Function 4.1 and 4.2 Data */
    const function_4_1 = async (object, event, newEvent) => {
        return new Promise(async (resolve, reject) => {
            await model.inboundReceipt.findOne(
                {
                    reference_number: object.reference_number
                },
                (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        result.function = data;
                        resolve(data);
                    }
                }
            );
        })
            .then(() => {
                let response = {
                    function: result.function,
                    event: event,
                    new_event: newEvent,
                    function_type: object.function
                };
                return apiHandler.setSuccessResponse(response, res, req);
            })
            .catch((err) => {
                return apiHandler.setErrorResponse(err, res, req);
            });
    };

    /*  NCL Data   */
    const function_5 = async (object, event, newEvent) => {
        return new Promise(async (resolve, reject) => {
            await model.ncl_schema.findOne({
                reference_number : object.reference_number
            }, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        })
            .then((ncl) => {
                let response = {
                    functiondata: ncl,
                    event: event,
                    newEvent
                };
                return apiHandler.setSuccessResponse(response, res, req);
            })
            .catch((err) => {
                return apiHandler.setErrorResponse(err, res, req);
            });
    };

    /*  Function 6.1 Data   */
    const function_6_1 = async (object, event, newEvent) => {
        return new Promise(async (resolve, reject) => {
            await model.function6_1.findById(object.reference_number).populate('ctos_id').exec((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    result.function = data;
                    resolve(data);
                }
            });
        })
            .then(() => {
                let response = {
                    function: result.function,
                    event: event,
                    new_event: newEvent,
                    function_type: object.function
                };
                return apiHandler.setSuccessResponse(response, res, req);
            })
            .catch((err) => {
                return apiHandler.setErrorResponse(err, res, req);
            });
    };

    const function_6_2 = async (object, event, newEvent) => {
        return new Promise(async (resolve, reject) => {
            await model.function6_2.findById(object.reference_number)
                .populate('ctos_id')
                .populate('ir_id')
                .exec((err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        result.function = data;
                        resolve(data);
                    }
                });
        })
            .then(() => {
                let response = {
                    function: result.function,
                    event: event,
                    new_event: newEvent,
                    function_type: object.function
                };
                return apiHandler.setSuccessResponse(response, res, req);
            })
            .catch((err) => {
                return apiHandler.setErrorResponse(err, res, req);
            });
    }



    new Promise((resolve, reject) => {
        model.event_logs.findOne({ _id: eventLogId }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                result.event = data;
                resolve(data);
            }
        });
    })
        .then((event) => {
            return new Promise(async (resolve, reject) => {
                if (!event) {
                    reject(new Error('Event Log Record Not Found'));
                } else {
                    if (result.event.type === functions.QA) {
                        model.event_logs.findOne(
                            {
                                event_number: result.event.objects.qa_passed
                            },
                            async (err, data) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    let splitArray = await splitData('-', result.event.objects.linked);
                                    result.object = {
                                        reference_number: splitArray[0] ? splitArray[0] : '',
                                        revision_number: splitArray[1] ? splitArray[1] : '',
                                        function: data.function
                                    };
                                    resolve(data);
                                }
                            }
                        );
                    } else {
                        if (
                            result.event.function === functions.FUNCTION_6_1 ||
                            result.event.function === functions.FUNCTION_6_2
                        ) {
                            result.object = {
                                reference_number: result.event.objects.created,
                                revision_number: '',
                                function: result.event.function
                            };
                        } else {
                            let splitArray = await splitData('-', result.event.objects.created);
                            result.object = {
                                reference_number: splitArray[0] ? splitArray[0] : '',
                                revision_number: splitArray[1] ? splitArray[1] : '',
                                function: result.event.function
                            };
                        }
                        resolve({});
                    }
                }
            });
        })
        .then(() => {
            return new Promise((resolve, reject) => {
                if (isLog === 'true') {
                    padDigits(10).then((num) => {
                        let event_number = `EN#${num}`;
                        let activity = {
                            type: functions.QA,
                            event_number: event_number,
                            user_id: req.user._id,
                            function: 'QA Check'
                        };
                        var newLog = new model.event_logs(activity);
                        model.event_logs.create(newLog, (err, eventLog) => {
                            if (err) {
                                reject(err);
                            } else {
                                result.newEventLog = eventLog;
                                resolve(eventLog);
                            }
                        });
                    });
                } else {
                    result.newEventLog = {};
                    resolve({});
                }
            });
        })
        .then(() => {
            switch (result.object.function) {
                case functions.FUNCTION_1_1:
                    clientData(result.object, result.event, result.newEventLog);
                    break;
                case functions.FUNCTION_1_2:
                    clientData(result.object, result.event, result.newEventLog);
                    break;
                case functions.FUNCTION_2_1:
                    ctosData(result.object, result.event, result.newEventLog);
                    break;
                case functions.FUNCTION_2_2:
                    ctosData(result.object, result.event, result.newEventLog);
                    break;
                case functions.FUNCTION_3:
                    asnData(result.object, result.event, result.newEventLog);
                    break;
                case functions.FUNCTION_4_1:
                    function_4_1(result.object, result.event, result.newEventLog);
                    break;
                case functions.FUNCTION_4_2:
                    function_4_1(result.object, result.event, result.newEventLog);
                    break;
                case functions.FUNCTION_5:
                    function_5(result.object, result.event, result.newEventLog);
                    break;
                case functions.FUNCTION_6_1:
                    function_6_1(result.object, result.event, result.newEventLog);
                    break;
                case functions.FUNCTION_6_2:
                    function_6_2(result.object, result.event, result.newEventLog);
                    break;
                default:
                    return apiHandler.setErrorResponse('UNKNOWN_ERROR', res, req);
            }
        })
        .catch((error) => {
            return apiHandler.setErrorResponse(error, res, req);
        });
};

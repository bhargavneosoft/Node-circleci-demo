import model from '../../schema';
import apiHandler from '../../../services/api-handler';
import functionConstant from '../../helpers/function-constant';
import validator from 'validator';

/**
 * Print Data Of All Function
 * @param {*} req 
 * @param {*} res 
 */
export const printData = (req, res) => {
    if (validator.isEmpty(req.body.function_type)) {
        apiHandler.setErrorResponse('FIELD_MISSING', res, req);
    } else {
        let result = {};
        const function1 = () => {
            new Promise(async (resolve, reject) => {
                await model.revision
                    .findOne({
                        reference_number: req.body.reference_no
                    })
                    .sort({ createdAt: -1 })
                    .exec((err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            if (!data) {
                                reject(new Error('Client Record Not Found.'));
                            } else {
                                result.function = data;
                                resolve(data);
                            }
                        }
                    });
            })
                .then(() => {
                    return new Promise(async (resolve, reject) => {
                        await model.event_logs.findOne(
                            {
                                event_number: result.function.data_qa.data_entry_event_number
                            },
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
                    let response = {
                        function: result.function
                        //function_type: result.event_log.function
                    };
                    return apiHandler.setSuccessResponse(response, res, req);
                })
                .catch((error) => {
                    apiHandler.setErrorResponse(error, res, req);
                });
        };

        const function2 = () => {
            new Promise(async (resolve, reject) => {
                await model.ctosRevisionModel
                    .findOne({
                        reference_number: req.body.reference_no
                    })
                    .sort({ createdAt: -1 })
                    .exec((err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            if (!data) {
                                reject(new Error('CTOS Record Not Found.'));
                            } else {
                                result.function = data;
                                resolve(data);
                            }
                        }
                    });
            })
                .then(() => {
                    return new Promise(async (resolve, reject) => {
                        await model.event_logs.findOne(
                            {
                                event_number: result.function.data_qa.data_entry_event_number
                            },
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
                    let response = {
                        function: result.function
                        //function_type: result.event_log.function
                    };
                    return apiHandler.setSuccessResponse(response, res, req);
                })
                .catch((error) => {
                    apiHandler.setErrorResponse(error, res, req);
                });
        };

        const function3 = () => {
            new Promise(async (resolve, reject) => {
                await model.asns
                    .findOne({
                        reference_number: req.body.reference_no
                    })
                    .sort({ createdAt: -1 })
                    .exec((err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            if (!data) {
                                reject(new Error('ASN Record Not Found.'));
                            } else {
                                result.function = data;
                                resolve(data);
                            }
                        }
                    });
            })
                .then(() => {
                    let response = {
                        function: result.function
                    };
                    return apiHandler.setSuccessResponse(response, res, req);
                })
                .catch((error) => {
                    apiHandler.setErrorResponse(error, res, req);
                });
        };

        const function4 = () => {
            new Promise(async (resolve, reject) => {
                await model.inboundReceipt
                    .findOne({
                        reference_number: req.body.reference_no
                    })
                    .sort({ createdAt: -1 })
                    .exec((err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            if (!data) {
                                reject(new Error('Inbound Record Not Found.'));
                            } else {
                                result.function = data;
                                resolve(data);
                            }
                        }
                    });
            })
                .then(() => {
                    let response = {
                        function: result.function
                    };
                    return apiHandler.setSuccessResponse(response, res, req);
                })
                .catch((error) => {
                    apiHandler.setErrorResponse(error, res, req);
                });
        };

        const function5 = () => {
            new Promise(async (resolve, reject) => {
                await model.ncl_schema
                    .findOne({
                        reference_number: req.body.reference_no
                    })
                    .populate('ctos_id')
                    .sort({ createdAt: -1 })
                    .exec((err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            if (!data) {
                                reject(new Error('NCL Record Not Found.'));
                            } else {
                                result.function = data;
                                resolve(data);
                            }
                        }
                    });
            })
                .then(() => {
                    let response = {
                        function: result.function
                    };
                    return apiHandler.setSuccessResponse(response, res, req);
                })
                .catch((error) => {
                    apiHandler.setErrorResponse(error, res, req);
                });
        };

        const function6_1 = () => {
            new Promise(async (resolve, reject) => {
                await model.function6_1
                    .findById(req.body.reference_no)
                    .populate('ctos_id')
                    .sort({ createdAt: -1 })
                    .exec((err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            if (!data) {
                                reject(new Error('Function 6.1 Record Not Found.'));
                            } else {
                                result.function = data;
                                resolve(data);
                            }
                        }
                    });
            })
                .then(() => {
                    let response = {
                        function: result.function
                    };
                    return apiHandler.setSuccessResponse(response, res, req);
                })
                .catch((error) => {
                    apiHandler.setErrorResponse(error, res, req);
                });
        };

        const function6_2 = () => {
            new Promise(async (resolve, reject) => {
                await model.function6_2
                    .findById(req.body.reference_no)
                    .populate('ctos_id')
                    .populate('ir_id')
                    .sort({ createdAt: -1 })
                    .exec((err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            if (!data) {
                                reject(new Error('Function 6.2 Record Not Found.'));
                            } else {
                                result.function = data;
                                resolve(data);
                            }
                        }
                    });
            })
                .then(() => {
                    let response = {
                        function: result.function
                    };
                    return apiHandler.setSuccessResponse(response, res, req);
                })
                .catch((error) => {
                    apiHandler.setErrorResponse(error, res, req);
                });
        };

        switch (req.body.function_type) {
            case functionConstant.FUNCTION_1 || functionConstant.FUNCTION_1_1 || functionConstant.FUNCTION_1_2:
                function1();
                break;

            case functionConstant.FUNCTION_2 || functionConstant.FUNCTION_2_1 || functionConstant.FUNCTION_2_2:
                function2();
                break;

            case functionConstant.FUNCTION_3:
                function3();
                break;

            case functionConstant.FUNCTION_4:
                function4();
                break;

            case functionConstant.FUNCTION_5:
                function5();
                break;

            case functionConstant.FUNCTION_6_1:
                function6_1();
                break;

            case functionConstant.FUNCTION_6_2:
                function6_2();
                break;

            default:
                return apiHandler.setErrorResponse('UNKNOWN_ERROR', res, req);
        }
    }
};

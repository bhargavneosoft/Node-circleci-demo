import model from '../../schema';
import apiHandler from '../../../services/api-handler';
import functionConstant from '../../helpers/function-constant';
import validator from 'validator';

/**
 * API For QA Status
 * @param req
 * @param res
 */
export const QAInput = (req, res) => {
    let findRole = req.user.roles[0].role_name;

    if (findRole === 'qa') {
        if (validator.isEmpty(req.body.function_type)) {
            apiHandler.setErrorResponse('FIELD_MISSING', res, req);
        } else {
            let result = {};

            /*  Client QA   */
            const client = () => {
                new Promise((resolve, reject) => {
                    model.event_logs.findOne(
                        {
                            _id: req.body.event_no
                        },
                        (err, data) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(data);
                            }
                        }
                    );
                })
                    .then((event) => {
                        return new Promise(function (resolve, reject) {
                            if (
                                event.qa_status === functionConstant.PASSED ||
                                event.qa_status === functionConstant.FAILED
                            ) {
                                reject(new Error(`QA is already ${event.qa_status} for ${event.function} `));
                            } else {
                                model.event_logs.findOneAndUpdate(
                                    {
                                        _id: req.body.event_no
                                    },
                                    { qa_status: req.body.qa_status },
                                    { new: true },
                                    (err, data) => {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            result.eventLog = data;
                                            resolve(data);
                                        }
                                    }
                                );
                            }
                        });
                    })
                    .then(() => {
                        return new Promise(function (resolve, reject) {
                            let revision = req.body.function_no + '-' + req.body.revision_no;
                            let newEventLog = {
                                qa_status: req.body.qa_status,
                                event_activity: `QA check: ${req.body.qa_status} on ${revision} by ${req.user
                                    .name} at `,
                                status: 1,
                                objects: {
                                    qa_passed: result.eventLog.event_number,
                                    linked: revision
                                }
                            };
                            model.event_logs.findOneAndUpdate(
                                { _id: req.body.new_event_no },
                                { $set: newEventLog },
                                { new: true },
                                (err, data) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        result.newEventLog = data;
                                        resolve(data);
                                    }
                                }
                            );
                        });
                    })
                    .then(() => {
                        return new Promise((resolve, reject) => {
                            model.revision.findOne(
                                {
                                    reference_number: req.body.function_no,
                                    revision_number: req.body.revision_no
                                },
                                (err, data) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        result.old_revision = data;
                                        resolve(data);
                                    }
                                }
                            );
                        });
                    })
                    .then(() => {
                        return new Promise(function (resolve, reject) {
                            let clientRevisionBody = {
                                data_qa: {
                                    data_entry_user: result.old_revision.data_qa.data_entry_user,
                                    data_entry_datetime: result.old_revision.data_qa.data_entry_datetime,
                                    data_entry_event_number: result.old_revision.data_qa.data_entry_event_number,
                                    qa_user: req.user._id,
                                    qa_status: req.body.qa_status,
                                    qa_comments: req.body.qa_comments,
                                    qa_datetime: new Date(),
                                    qa_event_number: result.newEventLog.event_number
                                }
                            };
                            model.revision.findOneAndUpdate(
                                {
                                    reference_number: req.body.function_no,
                                    revision_number: req.body.revision_no
                                },
                                {
                                    $set: clientRevisionBody
                                },
                                {
                                    new: true
                                },
                                (err, data) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        result.client_revision = data;
                                        resolve(data);
                                    }
                                }
                            );
                        });
                    })
                    .then(() => {
                        return new Promise(function (resolve, reject) {
                            let clientBody = {
                                qa_status: req.body.qa_status,
                                last_qa: result.newEventLog.updatedAt,
                                last_qa_id: req.user._id
                            };
                            model.clients.findOneAndUpdate(
                                { _id: result.client_revision.reference_id },
                                { $set: clientBody },
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
                        const { eventLog, newEventLog, client_revision, client } = result;
                        return apiHandler.setSuccessResponse(
                            { eventLog, newEventLog, client_revision, client },
                            res,
                            req
                        );
                    })
                    .catch((error) => {
                        apiHandler.setErrorResponse(error, res, req);
                    });
            };

            /*  CTOS QA   */
            const CTOS = () => {
                new Promise((resolve, reject) => {
                    model.event_logs.findOne(
                        {
                            _id: req.body.event_no
                        },
                        (err, data) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(data);
                            }
                        }
                    );
                })
                    .then((event) => {
                        return new Promise(function (resolve, reject) {
                            if (
                                event.qa_status === functionConstant.PASSED ||
                                event.qa_status === functionConstant.FAILED
                            ) {
                                reject(new Error(`QA is already ${event.qa_status} for ${event.function} `));
                            } else {
                                model.event_logs.findOneAndUpdate(
                                    {
                                        _id: req.body.event_no
                                    },
                                    { qa_status: req.body.qa_status },
                                    { new: true },
                                    (err, data) => {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            result.eventLog = data;
                                            resolve(data);
                                        }
                                    }
                                );
                            }
                        });
                    })
                    .then(() => {
                        return new Promise(function (resolve, reject) {
                            let revision = req.body.function_no + '-' + req.body.revision_no;
                            let newEventLog = {
                                qa_status: req.body.qa_status,
                                event_activity: `QA check: ${req.body.qa_status} on ${revision} by ${req.user
                                    .name} at `,
                                status: 1,
                                objects: {
                                    qa_passed: result.eventLog.event_number,
                                    linked: revision
                                }
                            };
                            model.event_logs.findOneAndUpdate(
                                { _id: req.body.new_event_no },
                                { $set: newEventLog },
                                { new: true },
                                (err, data) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        result.newEventLog = data;
                                        resolve(data);
                                    }
                                }
                            );
                        });
                    })
                    .then(() => {
                        return new Promise(async (resolve, reject) => {
                            await model.ctosRevisionModel.findOne(
                                {
                                    reference_number: req.body.function_no,
                                    revision_number: req.body.revision_no
                                },
                                (err, data) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        result.old_revision = data;
                                        resolve(data);
                                    }
                                }
                            );
                        });
                    })
                    .then(() => {
                        return new Promise(function (resolve, reject) {
                            let CTOSRevisionBody = {
                                data_qa: {
                                    data_entry_user: result.old_revision.data_qa.data_entry_user,
                                    data_entry_datetime: result.old_revision.data_qa.data_entry_datetime,
                                    data_entry_event_number: result.old_revision.data_qa.data_entry_event_number,
                                    qa_user: req.user._id,
                                    qa_status: req.body.qa_status,
                                    qa_comments: req.body.qa_comments,
                                    qa_datetime: new Date(),
                                    qa_event_number: result.newEventLog.event_number
                                }
                            };
                            model.ctosRevisionModel.findOneAndUpdate(
                                {
                                    reference_number: req.body.function_no,
                                    revision_number: req.body.revision_no
                                },
                                {
                                    $set: CTOSRevisionBody
                                },
                                {
                                    new: true
                                },
                                (err, data) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        result.ctos_revision = data;
                                        resolve(data);
                                    }
                                }
                            );
                        });
                    })
                    .then(() => {
                        return new Promise(function (resolve, reject) {
                            let CTOSBody = {
                                qa_status: req.body.qa_status,
                                last_qa: result.newEventLog.updatedAt,
                                last_qa_id: req.user._id
                            };
                            model.ctos.findOneAndUpdate(
                                { _id: result.ctos_revision.reference_id },
                                { $set: CTOSBody },
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
                        const { eventLog, newEventLog, ctos_revision, ctos } = result;
                        return apiHandler.setSuccessResponse({ eventLog, newEventLog, ctos_revision, ctos }, res, req);
                    })
                    .catch((error) => {
                        apiHandler.setErrorResponse(error, res, req);
                    });
            };

            /*  Function 4.1 QA   */
            const function4_1 = () => {
                new Promise((resolve, reject) => {
                    model.event_logs.findOne(
                        {
                            _id: req.body.event_no
                        },
                        (err, data) => {
                            if (err) {
                                reject(err);
                            } else {
                                if (!data) {
                                    reject(new Error('Event Log Record Not Found.'));
                                } else {
                                    resolve(data);
                                }
                            }
                        }
                    );
                })
                    .then((event) => {
                        return new Promise(function (resolve, reject) {
                            if (
                                event.qa_status === functionConstant.PASSED ||
                                event.qa_status === functionConstant.FAILED
                            ) {
                                reject(new Error(`QA is already ${event.qa_status} for ${event.function} `));
                            } else {
                                model.event_logs.findOneAndUpdate(
                                    {
                                        _id: req.body.event_no
                                    },
                                    { qa_status: req.body.qa_status },
                                    { new: true },
                                    (err, data) => {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            result.eventLog = data;
                                            resolve(data);
                                        }
                                    }
                                );
                            }
                        });
                    })
                    .then(() => {
                        return new Promise(function (resolve, reject) {
                            let revision = req.body.function_no;
                            let newEventLog = {
                                qa_status: req.body.qa_status,
                                event_activity: `QA check: ${req.body.qa_status} on ${revision} by ${req.user
                                    .name} at `,
                                status: 1,
                                objects: {
                                    qa_passed: result.eventLog.event_number,
                                    linked: revision
                                }
                            };
                            model.event_logs.findOneAndUpdate(
                                { _id: req.body.new_event_no },
                                { $set: newEventLog },
                                { new: true },
                                (err, data) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        result.newEventLog = data;
                                        resolve(data);
                                    }
                                }
                            );
                        });
                    })
                    .then(() => {
                        return new Promise((resolve, reject) => {
                            model.inboundReceipt.findOne(
                                {
                                    reference_number: req.body.function_no
                                },
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
                        return new Promise(function (resolve, reject) {
                            result.inbound.data_4_1.data_qa.qa_status = req.body.qa_status;
                            result.inbound.data_4_1.data_qa.qa_comments = req.body.qa_comments;
                            result.inbound.data_4_1.data_qa.qa_datetime = new Date();
                            result.inbound.data_4_1.data_qa.qa_event_number = result.newEventLog.event_number;
                            model.inboundReceipt.findOneAndUpdate(
                                {
                                    reference_number: req.body.function_no
                                },
                                {
                                    $set: { data_4_1: result.inbound.data_4_1 }
                                },
                                {
                                    new: true
                                },
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
                        const { eventLog, newEventLog, inbound } = result;
                        return apiHandler.setSuccessResponse({ eventLog, newEventLog, inbound }, res, req);
                    })
                    .catch((error) => {
                        apiHandler.setErrorResponse(error, res, req);
                    });
            };

            /*  Function 4.2 QA   */
            const function4_2 = () => {
                new Promise((resolve, reject) => {
                    model.event_logs.findOne(
                        {
                            _id: req.body.event_no
                        },
                        (err, data) => {
                            if (err) {
                                reject(err);
                            } else {
                                if (!data) {
                                    reject(new Error('Event Log Record Not Found.'));
                                } else {
                                    resolve(data);
                                }
                            }
                        }
                    );
                })
                    .then((event) => {
                        return new Promise(function (resolve, reject) {
                            if (
                                event.qa_status === functionConstant.PASSED ||
                                event.qa_status === functionConstant.FAILED
                            ) {
                                reject(new Error(`QA is already ${event.qa_status} for ${event.function} `));
                            } else {
                                model.event_logs.findOneAndUpdate(
                                    {
                                        _id: req.body.event_no
                                    },
                                    { qa_status: req.body.qa_status },
                                    { new: true },
                                    (err, data) => {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            result.eventLog = data;
                                            resolve(data);
                                        }
                                    }
                                );
                            }
                        });
                    })
                    .then(() => {
                        return new Promise(function (resolve, reject) {
                            let revision = req.body.function_no;
                            let newEventLog = {
                                qa_status: req.body.qa_status,
                                event_activity: `QA check: ${req.body.qa_status} on ${revision} by ${req.user
                                    .name} at `,
                                status: 1,
                                objects: {
                                    qa_passed: result.eventLog.event_number,
                                    linked: revision
                                }
                            };
                            model.event_logs.findOneAndUpdate(
                                { _id: req.body.new_event_no },
                                { $set: newEventLog },
                                { new: true },
                                (err, data) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        result.newEventLog = data;
                                        resolve(data);
                                    }
                                }
                            );
                        });
                    })
                    .then(() => {
                        return new Promise((resolve, reject) => {
                            model.inboundReceipt.findOne(
                                {
                                    reference_number: req.body.function_no
                                },
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
                        return new Promise(function (resolve, reject) {
                            result.inbound.data_4_2.data_qa.qa_status = req.body.qa_status;
                            result.inbound.data_4_2.data_qa.qa_comments = req.body.qa_comments;
                            result.inbound.data_4_2.data_qa.qa_datetime = new Date();
                            result.inbound.data_4_2.data_qa.qa_event_number = result.newEventLog.event_number;
                            model.inboundReceipt.findOneAndUpdate(
                                {
                                    reference_number: req.body.function_no
                                },
                                {
                                    $set: { data_4_2: result.inbound.data_4_2 }
                                },
                                {
                                    new: true
                                },
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
                        const { eventLog, newEventLog, inbound, ctos } = result;
                        return apiHandler.setSuccessResponse({ eventLog, newEventLog, inbound, ctos }, res, req);
                    })
                    .catch((error) => {
                        apiHandler.setErrorResponse(error, res, req);
                    });
            };

            /*  Function 5 QA   */
            const function5 = () => {
                new Promise((resolve, reject) => {
                    model.event_logs.findOne(
                        {
                            _id: req.body.event_no
                        },
                        (err, data) => {
                            if (err) {
                                reject(err);
                            } else {
                                if (!data) {
                                    reject(new Error('Event Log Record Not Found.'));
                                } else {
                                    resolve(data);
                                }
                            }
                        }
                    );
                })
                    .then((event) => {
                        return new Promise(function (resolve, reject) {
                            if (
                                event.qa_status === functionConstant.PASSED ||
                                event.qa_status === functionConstant.FAILED
                            ) {
                                reject(new Error(`QA is already ${event.qa_status} for ${event.function} `));
                            } else {
                                model.event_logs.findOneAndUpdate(
                                    {
                                        _id: req.body.event_no
                                    },
                                    { qa_status: req.body.qa_status },
                                    { new: true },
                                    (err, data) => {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            result.eventLog = data;
                                            resolve(data);
                                        }
                                    }
                                );
                            }
                        });
                    })
                    .then(() => {
                        return new Promise(function (resolve, reject) {
                            let revision = req.body.function_no;
                            let newEventLog = {
                                qa_status: req.body.qa_status,
                                event_activity: `QA check: ${req.body.qa_status} on ${revision} by ${req.user
                                    .name} at `,
                                status: 1,
                                objects: {
                                    qa_passed: result.eventLog.event_number,
                                    linked: revision
                                }
                            };
                            model.event_logs.findOneAndUpdate(
                                { _id: req.body.new_event_no },
                                { $set: newEventLog },
                                { new: true },
                                (err, data) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        result.newEventLog = data;
                                        resolve(data);
                                    }
                                }
                            );
                        });
                    })
                    .then(() => {
                        return new Promise((resolve, reject) => {
                            model.ncl_schema.findOne(
                                {
                                    reference_number: req.body.function_no
                                },
                                (err, data) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        result.ncl = data;
                                        resolve(data);
                                    }
                                }
                            );
                        });
                    })
                    .then(() => {
                        return new Promise(function (resolve, reject) {
                            result.ncl.data_qa.qa_status = req.body.qa_status;
                            result.ncl.data_qa.qa_comments = req.body.qa_comments;
                            result.ncl.data_qa.qa_datetime = new Date();
                            result.ncl.data_qa.qa_event_number = result.newEventLog.event_number;
                            model.ncl_schema.findOneAndUpdate(
                                {
                                    reference_number: req.body.function_no
                                },
                                {
                                    $set: { data_qa: result.ncl.data_qa }
                                },
                                {
                                    new: true
                                },
                                (err, data) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        result.ncl = data;
                                        resolve(data);
                                    }
                                }
                            );
                        });
                    })
                    .then(() => {
                        const { eventLog, newEventLog, ncl } = result;
                        return apiHandler.setSuccessResponse({ eventLog, newEventLog, ncl }, res, req);
                    })
                    .catch((error) => {
                        apiHandler.setErrorResponse(error, res, req);
                    });
            };

            /*  Function 6.1 QA   */
            const function6_1 = () => {
                new Promise((resolve, reject) => {
                    model.event_logs.findOne(
                        {
                            _id: req.body.event_no
                        },
                        (err, data) => {
                            if (err) {
                                reject(err);
                            } else {
                                if (!data) {
                                    reject(new Error('Event Log Record Not Found.'));
                                } else {
                                    result.eventlog = data;
                                    resolve(data);
                                }
                            }
                        }
                    );
                })
                    .then((event) => {
                        return new Promise(function (resolve, reject) {
                            if (
                                event.qa_status === functionConstant.PASSED ||
                                event.qa_status === functionConstant.FAILED
                            ) {
                                reject(new Error(`QA is already ${event.qa_status} for ${event.function} `));
                            } else {
                                model.event_logs.findOneAndUpdate(
                                    { _id: req.body.event_no },
                                    { qa_status: req.body.qa_status },
                                    { new: true },
                                    (err, data) => {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            result.eventLog = data;
                                            resolve(data);
                                        }
                                    }
                                );
                            }
                        });
                    })
                    .then(() => {
                        return new Promise(function (resolve, reject) {
                            let newEventLog = {
                                qa_status: req.body.qa_status,
                                event_activity: `QA check: ${req.body.qa_status} on function 6.1 linked with ${req.body
                                    .function_no} by ${req.user.name} at `,
                                status: 1,
                                objects: result.eventLog.objects
                            };
                            model.event_logs.findOneAndUpdate(
                                { _id: req.body.new_event_no },
                                { $set: newEventLog },
                                { new: true },
                                (err, data) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        result.newEventLog = data;
                                        resolve(data);
                                    }
                                }
                            );
                        });
                    })
                    .then(() => {
                        return new Promise((resolve, reject) => {
                            model.function6_1.findById(result.eventlog.objects.created, (err, data) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    result.function6 = data;
                                    resolve(data);
                                }
                            });
                        });
                    })
                    .then((function6) => {
                        return new Promise(function (resolve, reject) {
                            let qa_data = {
                                data_entry_user: function6.data_qa.data_entry_user,
                                data_entry_datetime: function6.data_qa.data_entry_datetime,
                                data_entry_event_number: function6.data_qa.data_entry_event_number,
                                qa_user: req.user._id,
                                qa_status: req.body.qa_status,
                                qa_comments: req.body.qa_comments,
                                qa_datetime: new Date(),
                                qa_event_number: result.newEventLog.event_number
                            };
                            model.function6_1.findOneAndUpdate(
                                {
                                    _id: result.eventlog.objects.created
                                },
                                {
                                    $set: { data_qa: qa_data }
                                },
                                { new: true },
                                (err, data) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        result.function6_1 = data;
                                        resolve(data);
                                    }
                                }
                            );
                        });
                    })
                    .then(() => {
                        const { eventLog, newEventLog, function6_1 } = result;
                        return apiHandler.setSuccessResponse({ eventLog, newEventLog, function6_1 }, res, req);
                    })
                    .catch((error) => {
                        apiHandler.setErrorResponse(error, res, req);
                    });
            };

            const function6_2 = () => {
                new Promise((resolve, reject) => {
                    model.event_logs.findOne(
                        {
                            _id: req.body.event_no
                        },
                        (err, data) => {
                            if (err) {
                                reject(err);
                            } else {
                                if (!data) {
                                    reject(new Error('Event Log Record Not Found.'));
                                } else {
                                    result.eventlog = data;
                                    resolve(data);
                                }
                            }
                        }
                    );
                })
                    .then((event) => {
                        return new Promise(function (resolve, reject) {
                            if (
                                event.qa_status === functionConstant.PASSED ||
                                event.qa_status === functionConstant.FAILED
                            ) {
                                reject(new Error(`QA is already ${event.qa_status} for ${event.function} `));
                            } else {
                                model.event_logs.findOneAndUpdate(
                                    { _id: req.body.event_no },
                                    { qa_status: req.body.qa_status },
                                    { new: true },
                                    (err, data) => {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            result.eventLog = data;
                                            resolve(data);
                                        }
                                    }
                                );
                            }
                        });
                    })
                    .then(() => {
                        return new Promise(function (resolve, reject) {
                            let newEventLog = {
                                qa_status: req.body.qa_status,
                                event_activity: `QA check: ${req.body.qa_status} on function 6.2 linked with ${req.body
                                    .function_no} by ${req.user.name} at `,
                                status: 1,
                                objects: result.eventLog.objects
                            };
                            model.event_logs.findOneAndUpdate(
                                { _id: req.body.new_event_no },
                                { $set: newEventLog },
                                { new: true },
                                (err, data) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        result.newEventLog = data;
                                        resolve(data);
                                    }
                                }
                            );
                        });
                    })
                    .then(() => {
                        return new Promise((resolve, reject) => {
                            model.function6_2.findById(result.eventlog.objects.created, (err, data) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    result.function6 = data;
                                    resolve(data);
                                }
                            });
                        });
                    })
                    .then((function6) => {
                        return new Promise(function (resolve, reject) {
                            let qa_data = {
                                data_entry_user: function6.data_qa.data_entry_user,
                                data_entry_datetime: function6.data_qa.data_entry_datetime,
                                data_entry_event_number: function6.data_qa.data_entry_event_number,
                                qa_user: req.user._id,
                                qa_status: req.body.qa_status,
                                qa_comments: req.body.qa_comments,
                                qa_datetime: new Date(),
                                qa_event_number: result.newEventLog.event_number
                            };
                            model.function6_2.findOneAndUpdate(
                                {
                                    _id: result.eventlog.objects.created
                                },
                                {
                                    $set: { data_qa: qa_data }
                                },
                                { new: true },
                                (err, data) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        result.function6_2 = data;
                                        resolve(data);
                                    }
                                }
                            );
                        });
                    })
                    .then(() => {
                        const { eventLog, newEventLog, function6_2 } = result;
                        return apiHandler.setSuccessResponse({ eventLog, newEventLog, function6_2 }, res, req);
                    })
                    .catch((error) => {
                        apiHandler.setErrorResponse(error, res, req);
                    });
            };

            switch (req.body.function_type) {
                case functionConstant.FUNCTION_1_1:
                    client();
                    break;

                case functionConstant.FUNCTION_1_2:
                    client();
                    break;

                case functionConstant.FUNCTION_2_1:
                    CTOS();
                    break;

                case functionConstant.FUNCTION_2_2:
                    CTOS();
                    break;

                case functionConstant.FUNCTION_4_1:
                    function4_1();
                    break;

                case functionConstant.FUNCTION_4_2:
                    function4_2();
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
    } else {
        return apiHandler.setErrorResponse('ROLE_UNAUTHORIZED', res, req);
    }
};

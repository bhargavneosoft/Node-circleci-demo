import model from '../../schema';
import apiHandler from '../../../services/api-handler';
import functionConstant from '../../helpers/function-constant';
import validator from 'validator';
import { splitData } from '../../helpers/utils';
import _ from 'lodash';

/**
 * Search For All Function
 * @param {*} req 
 * @param {*} res 
 */
export const search = (req, res) => {
	if (validator.isEmpty(req.body.function_type)) {
		apiHandler.setErrorResponse('FIELD_MISSING', res, req);
	} else {
		let result = {};

		/*  Event Log Search   */
		const event_log = () => {
			let limit = req.query.limit ? parseInt(req.query.limit) : 15,
				pageNo = req.query.page_no ? parseInt(req.query.page_no) - 1 : 0,
				sortBy = req.query.sortBy ? req.query.sortBy : 'createdAt',
				sort_order = req.query.sort_order ? req.query.sort_order : -1,
				sortCondition = { [sortBy]: sort_order },
				flag = req.query.status,
				search = req.body.keyword;
			var searchCondition = {
				$or: [
					{ event_number: new RegExp(search, 'i') },
					{ event_activity: new RegExp(search, 'i') },
					{ objects: new RegExp(search, 'i') }
				]
			};

			new Promise((resolve, reject) => {
				model.event_logs.fetchAllEventsCount(flag, searchCondition, (err, clients) => {
					if (err) {
						reject(new Error(err));
					} else {
						result.count = clients.length;
						resolve(clients);
					}
				});
			})
				.then(() => {
					return new Promise((resolve, reject) => {
						model.event_logs.fetchAllEvents(
							pageNo,
							limit,
							flag,
							sortCondition,
							searchCondition,
							(err, clients) => {
								if (err) {
									reject(new Error(err));
								} else {
									result.events = clients;
									resolve();
								}
							}
						);
					});
				})
				.then(() => {
					const { events, count } = result;
					return apiHandler.setSuccessResponse({ events, count }, res, req);
				})
				.catch((error) => {
					return apiHandler.setErrorResponse(error, res, req);
				});
		};

		/*  Client Search (f1)  */
		const client = () => {
			let limit = req.query.limit ? parseInt(req.query.limit) : 15,
				pageNo = req.query.page_no ? parseInt(req.query.page_no) - 1 : 0,
				sortBy = req.query.sortBy ? req.query.sortBy : 'createdAt',
				sort_order = req.query.sort_order ? req.query.sort_order : -1,
				sortCondition = { [sortBy]: sort_order },
				flag = req.query.status,
				search = req.body.keyword;
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

			new Promise((resolve, reject) => {
				model.clients.fetchAllClientsCount(flag, searchCondition, (err, clients) => {
					if (err) {
						reject(new Error(err));
					} else {
						result.count = clients.length;
						resolve(clients);
					}
				});
			})
				.then(() => {
					return new Promise((resolve, reject) => {
						model.clients.fetchAllClients(
							pageNo,
							limit,
							flag,
							sortCondition,
							searchCondition,
							(err, clients) => {
								if (err) {
									reject(new Error(err));
								} else {
									result.clients = clients;
									resolve();
								}
							}
						);
					});
				})
				.then(() => {
					const { clients, count } = result;
					return apiHandler.setSuccessResponse({ clients, count }, res, req);
				})
				.catch((error) => {
					return apiHandler.setErrorResponse(error, res, req);
				});
		};

		/*  CTOS Search (f2)  */
		const ctos = () => {
			new Promise((resolve, reject) => {
				model.ctosRevisionModel
					.findOne({
						reference_number: req.body.keyword,
						active: functionConstant.ACTIVE
					})
					.sort({ createdAt: -1 })
					.exec((err, ctos_revision) => {
						if (err || !ctos_revision) {
							reject(new Error('CTOS Record Not Found'));
						} else {
							result.ctos_revision = ctos_revision;
							resolve(ctos_revision);
						}
					});
			})
				.then(() => {
					return new Promise((resolve, reject) => {
						model.ctos.findById(result.ctos_revision.reference_id, (err, ctos) => {
							if (err || !ctos) {
								reject(new Error('CTOS Record Not Found'));
							} else {
								if (ctos.qa_status === functionConstant.PENDING) {
									reject(new Error('QA has not approved the CTOS details'));
								} else {
									result.ctos = ctos;
									resolve(ctos);
								}
							}
						});
					});
				})
				.then(() => {
					let { ctos, ctos_revision } = result;
					return apiHandler.setSuccessResponse({ ctos, ctos_revision }, res, req);
				})
				.catch((error) => {
					return apiHandler.setErrorResponse(error, res, req);
				});
		};

		/*  ASN Search (f3) */
		const function3 = () => {
			new Promise((resolve, reject) => {
				model.asns.findOne(
					{
						reference_number: req.body.keyword,
						active: functionConstant.ACTIVE
					},
					(err, asn) => {
						if (err) {
							reject(new Error(err));
						} else {
							result.asn = asn;
							resolve(asn);
						}
					}
				);
			})
				.then(() => {
					const { asn, count } = result;
					return apiHandler.setSuccessResponse({ asn, count }, res, req);
				})
				.catch((error) => {
					return apiHandler.setErrorResponse(error, res, req);
				});
		};

		/*  Inbound Reciept Search (f4)  */
		const ir = () => {
			new Promise((resolve, reject) => {
				model.inboundReceipt
					.findOne({
						reference_number: req.body.keyword,
						active: functionConstant.ACTIVE
					})
					.exec((err, irData) => {
						if (err || !irData) {
							reject(new Error('Inbound Record Not Found'));
						} else {
							result.irData = irData;
							resolve(irData);
						}
					});
			})
				.then(() => {
					let { irData } = result;
					return apiHandler.setSuccessResponse({ irData }, res, req);
				})
				.catch((error) => {
					return apiHandler.setErrorResponse(error, res, req);
				});
		};

		/*  NCL Search (f5) */
		const ncl = () => {
			let query;
			let result = {};
			switch (req.query.type) {
				case '1':
					query = new Promise(async (resolve, reject) => {
						await model.ncl_schema
							.findOne({
								reference_number: req.body.keyword,
								active: functionConstant.ACTIVE,
								'data_qa.qa_status': functionConstant.PASSED
							})
							.exec((err, data) => {
								if (err) {
									reject(err);
								} else {
									result.ctos = data;
									resolve(data);
								}
							});
					});
					break;
				case '2':
					query = new Promise(async (resolve, reject) => {
						await model.ncl_schema
							.findOne({
								'data.non_critical_label_desc': new RegExp(req.body.keyword, 'i'),
								active: functionConstant.ACTIVE,
								'data_qa.qa_status': functionConstant.PASSED
							})
							.exec((err, data) => {
								if (err) {
									reject(err);
								} else {
									result.ctos = data;
									resolve(data);
								}
							});
					});
					break;
				case '3':
					query = new Promise(async (resolve, reject) => {
						await model.ctosRevisionModel
							.findOne({
								reference_number: req.body.keyword,
								active: functionConstant.ACTIVE,
								'data_qa.qa_status': functionConstant.PASSED
							})
							.populate('reference_id')
							.sort({ createdAt: -1 })
							.exec((err, data) => {
								if (err) {
									reject(err);
								} else {
									result.ctos = data;
									resolve(data);
								}
							});
					});
					break;

				case '4':
					query = new Promise(async (resolve, reject) => {
						await model.ncl_schema
							.findOne({
								'data.study_number': new RegExp(req.body.keyword, 'i'),
								active: functionConstant.ACTIVE,
								'data_qa.qa_status': functionConstant.PASSED
							})
							.exec((err, data) => {
								if (err) {
									reject(err);
								} else {
									result.ctos = data;
									resolve(data);
								}
							});
					});
					break;

				case '5':
					query = new Promise(async (resolve, reject) => {
						await model.ncl_schema
							.findOne({
								'data.product_description': new RegExp(req.body.keyword, 'i'),
								active: functionConstant.ACTIVE,
								'data_qa.qa_status': functionConstant.PASSED
							})
							.exec((err, data) => {
								if (err) {
									reject(err);
								} else {
									result.ctos = data;
									resolve(data);
								}
							});
					});
					break;
				case '6':
					query = new Promise(async (resolve, reject) => {
						await model.inboundReceipt
							.findOne({
								reference_number: req.body.keyword,
								active: functionConstant.ACTIVE,
								'data_4_1.data_qa.qa_status': functionConstant.PASSED
							})
							.populate('reference_id')
							.sort({ createdAt: -1 })
							.exec((err, data) => {
								if (err) {
									reject(err);
								} else {
									result.inbound = data;
									resolve(data);
								}
							});
					});
					break;

				case '7':
					let search = splitData('-', req.body.keyword);
					query = new Promise(async (resolve, reject) => {
						await model.inboundReceipt
							.findOne({
								reference_number: search,
								active: functionConstant.ACTIVE,
								'data_4_1.data_qa.qa_status': functionConstant.PASSED
							})
							.populate('reference_id')
							.sort({ createdAt: -1 })
							.exec((err, data) => {
								if (err) {
									reject(err);
								} else {
									if (!data) {
										reject(new Error('Inbound record not found'));
									} else {
										var array = Object.keys(data.data_4_1.outer_boxes).map(function(key) {
											return key;
										});
										let filterArray = array.filter((item) => item.indexOf(req.body.keyword) > -1);
										if (filterArray.length > 0) {
											result.inbound = data;
											resolve(data);
										} else {
											reject(new Error('Inbound record not found'));
										}
									}
								}
							});
					});
					break;
				default:
					query = new Promise((resolve, reject) => (err ? reject(err) : resolve({})));
					break;
			}

			query
				.then(() => {
					return apiHandler.setSuccessResponse(result, res, req);
				})
				.catch((error) => {
					return apiHandler.setErrorResponse(error, res, req);
				});
		};

		/*  Function 6.1   */
		const function6_1 = () => {
			let query;
			switch (req.query.type) {
				case '1':
					query = {
						reference_number: req.body.keyword,
						active: functionConstant.ACTIVE,
						'data_qa.qa_status': functionConstant.PASSED
					};
					break;
				case '2':
					query = {
						'data.study_number': new RegExp(req.body.keyword, 'i'),
						active: functionConstant.ACTIVE,
						'data_qa.qa_status': functionConstant.PASSED
					};
					break;
				case '3':
					query = {
						'data.product_info.product_description': new RegExp(req.body.keyword, 'i'),
						active: functionConstant.ACTIVE,
						'data_qa.qa_status': functionConstant.PASSED
					};
					break;
				default:
					query = { reference_number: '' };
					break;
			}

			new Promise(async (resolve, reject) => {
				await model.ctosRevisionModel
					.findOne(query)
					.populate('reference_id')
					.sort({ createdAt: -1 })
					.exec((err, data) => {
						if (err) {
							reject(err);
						} else {
							resolve(data);
						}
					});
			})
				.then((ctos) => {
					return apiHandler.setSuccessResponse({ ctos }, res, req);
				})
				.catch((error) => {
					return apiHandler.setErrorResponse(error, res, req);
				});
		};

		/*  Function 6.2   */
		const function6_2 = () => {
			let query;
			let result = {};
			switch (req.query.type) {
				case '1':
					query = new Promise(async (resolve, reject) => {
						await model.ctosRevisionModel
							.findOne({
								reference_number: req.body.keyword,
								active: functionConstant.ACTIVE,
								'data_qa.qa_status': functionConstant.PASSED
							})
							.populate('reference_id')
							.sort({ createdAt: -1 })
							.exec((err, data) => {
								if (err) {
									reject(err);
								} else {
									result.ctos = data;
									resolve(data);
								}
							});
					});
					break;
				case '2':
					query = new Promise(async (resolve, reject) => {
						await model.ctosRevisionModel
							.findOne({
								'data.study_number': new RegExp(req.body.keyword, 'i'),
								active: functionConstant.ACTIVE,
								'data_qa.qa_status': functionConstant.PASSED
							})
							.populate('reference_id')
							.sort({ createdAt: -1 })
							.exec((err, data) => {
								if (err) {
									reject(err);
								} else {
									result.ctos = data;
									resolve(data);
								}
							});
					});
					break;
				case '3':
					query = new Promise(async (resolve, reject) => {
						await model.ctosRevisionModel
							.findOne({
								'data.product_info.product_description': new RegExp(req.body.keyword, 'i'),
								active: functionConstant.ACTIVE,
								'data_qa.qa_status': functionConstant.PASSED
							})
							.populate('reference_id')
							.sort({ createdAt: -1 })
							.exec((err, data) => {
								if (err) {
									reject(err);
								} else {
									result.ctos = data;
									resolve(data);
								}
							});
					});
					break;
				case '4':
					query = new Promise(async (resolve, reject) => {
						await model.inboundReceipt
							.findOne({
								reference_number: req.body.keyword,
								active: functionConstant.ACTIVE,
								'data_4_1.data_qa.qa_status': functionConstant.PASSED
							})
							.populate('reference_id')
							.sort({ createdAt: -1 })
							.exec((err, data) => {
								if (err) {
									reject(err);
								} else {
									result.inbound = data;
									resolve(data);
								}
							});
					});
					break;
				case '5':
					let search = splitData('-', req.body.keyword);
					query = new Promise(async (resolve, reject) => {
						await model.inboundReceipt
							.findOne({
								reference_number: search,
								active: functionConstant.ACTIVE,
								'data_4_1.data_qa.qa_status': functionConstant.PASSED
							})
							.populate('reference_id')
							.sort({ createdAt: -1 })
							.exec((err, data) => {
								if (err) {
									reject(err);
								} else {
									if (!data) {
										reject(new Error('Inbound record not found'));
									} else {
										var array = Object.keys(data.data_4_1.outer_boxes).map(function(key) {
											return key;
										});
										let filterArray = array.filter((item) => item.indexOf(req.body.keyword) > -1);
										if (filterArray.length > 0) {
											result.inbound = data;
											resolve(data);
										} else {
											reject(new Error('Inbound record not found'));
										}
									}
								}
							});
					});
					break;
				default:
					query = new Promise((resolve, reject) => (err ? reject(err) : resolve({})));
					break;
			}

			query
				.then(() => {
					return apiHandler.setSuccessResponse(result, res, req);
				})
				.catch((error) => {
					return apiHandler.setErrorResponse(error, res, req);
				});
		};

		switch (req.body.function_type) {
			case functionConstant.FUNCTION_1_1:
				client();
				break;

			case functionConstant.FUNCTION_3:
				function3();
				break;

			case functionConstant.EVENT:
				event_log();
				break;

			case functionConstant.CTOS:
				ctos();
				break;

			case functionConstant.IR:
				ir();
				break;

			case functionConstant.NCL:
				ncl();
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

import ErrorCode from '../server/helpers/error-code';
import ErrorConstant from '../server/helpers/error-constants';
import log from '../server/modules/debuggerLogs/logModel';

export default {
	setErrorResponse: (error, res, req) => {
		// Generic error response setter
		var newLog = new log({
			endPoint: req.protocol + '://' + req.get('host') + req.originalUrl,
			reqHeader: req.headers,
			reqBody: req.body,
			response: error
		});
		log.createLog(newLog);
		var response = {
			error: {
				code: ErrorCode[error] || error.code,
				message: ErrorConstant[error] || error.message,
				name: error || error.name
			},
			success: {
				status: 0,
				data: ''
			}
		};
		return res.status(ErrorCode['HTTP_FAILED']).send(response);
	},

	setSuccessResponse: (data, res, req) => {
		// Generic success response setter
		var newLog = new log({
			endPoint: req.protocol + '://' + req.get('host') + req.originalUrl,
			reqHeader: req.headers,
			reqBody: req.body,
			response: data
		});
		log.createLog(newLog);
		var response = {
			error: {
				code: '',
				message: ''
			},
			success: {
				status: 1,
				data: data
			}
		};
		return res.status(ErrorCode['HTTP_SUCCESS']).send(response);
	}
};

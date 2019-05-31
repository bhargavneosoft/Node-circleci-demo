import Mongoose from 'mongoose';
import appConfig from '../../../config/config';

var logSchema = new Mongoose.Schema(
	{
		endPoint: {
			type: String
		},
		reqHeader: {
			type: {}
		},
		reqBody: {
			type: {}
		},
		response: {
			type: {}
		}
	},
	{ timestamps: true },
	{ capped: { size: 9232768, max: 1000, autoIndexId: true } }
);

var log = Mongoose.model('log', logSchema);

/**
 * Method
 * @param log
 * @param callback
 */
log.createLog = function(log, callback) {
	log.save(callback);
	if (appConfig.isDebugged) {
	}
};

export default log;

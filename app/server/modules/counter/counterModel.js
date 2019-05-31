import Mongoose from 'mongoose';

/*
 Counter schema
 */
var counterSchema = Mongoose.Schema({
	client_reference: {
		type: Number,
		default: 0
	},
	event_log: {
		type: Number,
		default: 1
	},
	target: {
		type: String,
		default: 'target'
	},
	operator_qa_reference: {
		type: Number,
		default: 0
	},
	ctos_number: {
		type: Number,
		default: 0
	},
	IR_number: {
		type: Number,
		default: 0
	},
	outerbox_reference: {
		type: Number,
		default: 0
	},
	ASN_number: {
		type: Number,
		default: 0
	},
	NCL_number: {
		type: Number,
		default: 0
	}
});

var counter = Mongoose.model('counter', counterSchema);

counter.createCounter = async (counterData, callback) => {
	try {
		return await counterData.save(callback);
	} catch (err) {
		return Promise.reject(err);
	}
};

/**
 * Method to get the counter document.
 * @param id
 * @param callback
 */
counter.getCount = (callback) => {
	counter.findOne({}, callback);
};
export default counter;

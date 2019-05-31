import Mongoose from 'mongoose';

/*
 Function schema
 */
var functionSchema = new Mongoose.Schema({
	name: { type: String },
	function_no: {
		type: String,
		trim: true
	},
	privileges: {
		type: Array
	}
});

var functions = Mongoose.model('functions', functionSchema);

/**
 * Method to create the entry for the pre-defined functions
 * @param docs
 * @param callback
 */
functions.createFunctions = (docs, callback) => {
	functions.insertMany(docs, callback);
};
export default functions;

var Mongoose = require('mongoose');
import Counter from '../counter/counterModel';
import constant from '../../helpers/function-constant';

/*
 Client schema
 */
var clientSchema = Mongoose.Schema(
	{
		isNewlyCreated: {
			type: Boolean,
			required: true,
			default: true
		},
		revisions: {
			type: Array,
			default: []
		},
		active: {
			type: String,
			enum: [ constant.ACTIVE, constant.INACTIVE ],
			default: constant.INACTIVE
		},
		qa_status: {
			type: String,
			enum: [ constant.PENDING, constant.PASSED, constant.FAILED ],
			default: constant.PENDING
		},
		last_updated: {
			type: Date
		},
		last_updated_id: {
			type: String,
			default: ''
		},
		last_qa: {
			type: Date
		},
		last_qa_id: {
			type: Mongoose.Schema.ObjectId,
			ref: 'User',
			default: null
		}
	},
	{ timestamps: true }
);

clientSchema.pre('save', function(next) {
	let doc = this;
	if (doc.isNewlyCreated) {
		Counter.findOneAndUpdate(
			{ target: 'target' },
			{ $inc: { client_reference: 1 } },
			{ upsert: true, new: true },
			(error, counter) => {
				if (error) return next(error);
				function padDigit(number, digits) {
					return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
				}
				doc.reference_no = `CR#${padDigit(counter.client_reference, 10)}`;
				doc.isNewlyCreated = false;
				next();
			}
		);
	} else {
		next();
	}
});

var clients = Mongoose.model('clients', clientSchema);

/**
 * Method to get all the available clients
 * @param searchCondition
 * @param callback
 */
clients.fetchAllClientsCount = (status, searchCondition, callback) => {
	let project = {
		name: '$user.data.client_name',
		reference_no: '$user.reference_number',
		contact_position: '$user.data.client_contact_position',
		contact_address: '$user.data.client_contact_address',
		email: '$user.data.client_contact_email',
		contactNumber: '$user.data.client_contact_number',
		isActive: '$user.active',
		user_id: '$user.data.reference_id'
	};
	let lookup = {
		from: 'revisions', // name of the model to lookup to
		localField: '_id',
		foreignField: 'reference_id',
		as: 'user'
	};

	if (status === 'All') {
		clients
			.aggregate([
				{
					$lookup: lookup
				},
				{ $unwind: '$user' },
				{ $project: project },
				{ $match: searchCondition }
			])
			.exec(callback);
	} else {
		clients
			.aggregate([
				{ $match: { active: status } },

				{
					$lookup: lookup
				},
				{ $unwind: '$user' },

				{ $project: project },
				{ $match: searchCondition }
			])
			.exec(callback);
	}
};

/**
 * Method to get all the available clients
 * @param pageNo
 * @param limit
 * @param status 
 * @param sortCondition
 * @param searchCondition
 * @param callback
 */
clients.fetchAllClients = (pageNo, limit, status, sortCondition, searchCondition, callback) => {
	let project = {
		name: '$user.data.client_name',
		reference_no: '$user.reference_number',
		contact_position: '$user.data.client_contact_position',
		contact_address: '$user.data.client_contact_address',
		email: '$user.data.client_contact_email',
		contactNumber: '$user.data.client_contact_number',
		isActive: '$user.active',
		user_id: '$user.data.reference_id'
	};
	let lookup = {
		from: 'revisions', // name of the model to lookup to
		localField: '_id',
		foreignField: 'reference_id',
		as: 'user'
	};

	if (status === 'All') {
		clients
			.aggregate([
				{
					$lookup: lookup
				},
				{ $unwind: '$user' },
				{ $project: project },
				{ $match: searchCondition }
			])
			.sort(sortCondition)
			.skip(pageNo * limit)
			.limit(limit)
			.exec(callback);
	} else {
		clients
			.aggregate([
				{ $match: { active: status } },

				{
					$lookup: lookup
				},
				{ $unwind: '$user' },
				{ $project: project },
				{ $match: searchCondition }
			])
			.sort(sortCondition)
			.skip(pageNo * limit)
			.limit(limit)
			.exec(callback);
	}
};

export default clients;

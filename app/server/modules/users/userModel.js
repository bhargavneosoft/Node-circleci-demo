var Mongoose = require('mongoose'),
	ObjectId = Mongoose.Types.ObjectId,
	Bcrypt = require('bcryptjs');

var UserSchema = new Mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			trim: true
		},
		name: {
			type: String,
			required: true
		},
		gender: {
			type: String,
			enum: [ 'Male', 'Female' ]
		},
		contact_position: {
			type: String,
			maxlength: 50,
			default: ''
		},
		contact_address: {
			type: String,
			maxlength: 50,
			default: ''
		},
		operator_id: {
			type: String
		},
		contactNumber: {
			type: String
		},
		contactName: {
			type: String,
			trim: true
		},
		password: {
			type: String,
			trim: true
		},
		isActive: {
			status: {
				type: Boolean,
				default: true
			},
			action_date: {
				type: Date,
				default: Date.now
			},
			archieve_date: {
				type: Date,
				default: null
			}
		},
		roles: [
			{
				roleId: {
					type: Mongoose.Schema.ObjectId,
					ref: 'Role'
				},
				role_name: {
					type: String
				}
			}
		],
		isAdmin: {
			type: Boolean,
			default: false
		}
	},
	{ timestamps: true }
);

UserSchema.pre('save', function(next) {
	var self = this;
	if (this.password && this.isModified('password')) {
		Bcrypt.genSalt(10, function(err, salt) {
			Bcrypt.hash(self.password, salt, function(err, hash) {
				self.password = hash;
				next();
			});
		});
	} else {
		next();
	}
});

var User = Mongoose.model('User', UserSchema);

/**
 * Method to compare password.
 * @param candidatePassword
 * @param hash
 * @param callback
 */
User.comparePassword = function(candidatePassword, hash, callback) {
	Bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
		if (err) {
			throw err;
		}
		callback(null, isMatch);
	});
};

/**
 * Method to create new user.
 * @param newUser
 * @param callback
 */
User.createUser = (newUser, callback) => {
	newUser.save(callback);
};

/**
 * Method to get user by its id.
 * @param newUser
 * @param callback
 */
User.getUserById = (id, callback) => {
	User.findOne({ _id: id }).select('-password').exec(callback);
};

/**
 * Method to get user by its email.
 * @param newUser
 * @param callback
 */
User.getUserByEmail = (email, callback) => {
	User.findOne({ email }, callback);
};

/**
 * Method to get user by its email.
 * @param newUser
 * @param callback
 */
User.checkAlreadyExistingEmail = (id, email, callback) => {
	User.findOne({ $and: [ { email }, { _id: { $ne: Object(id) } } ] }, callback);
};

/**
 * Method to remove the  user by its user id.
 * @param newUser
 * @param callback
 */
User.removeById = (id, callback) => {
	User.findOneAndDelete({ _id: id }, callback);
};

/**
 * Method to get all the available operators
 * @param status
 * @param searchCondition
 * @param callback
 */
User.fetchAllOperatorsCount = (status, searchCondition, callback) => {
	let project = {
		name: '$name',
		operator_id: '$operator_id',
		contact_position: '$contact_position',
		contact_address: '$contact_address',
		email: '$email',
		contactNumber: '$contactNumber',
		isActive: '$isActive.status'
	};
	if (status === 'all') {
		User.aggregate([
			{
				$match: {
					$or: [ { 'roles.role_name': 'operator' }, { 'roles.role_name': 'qa' } ]
				}
			},
			{ $project: project },
			{ $match: searchCondition }
		]).exec(callback);
	} else {
		User.aggregate([
			{
				$match: {
					$or: [ { 'roles.role_name': 'operator' }, { 'roles.role_name': 'qa' } ]
				}
			},
			{ $match: { 'isActive.status': status } },
			{ $project: project },
			{ $match: searchCondition }
		]).exec(callback);
	}
};

/**
 * Method to get all the available operators
 * @param pageNo
 * @param limit
 * @param status 
 * @param sortCondition
 * @param searchCondition
 * @param callback
 */
User.fetchAllOperators = (pageNo, limit, status, sortCondition, searchCondition, callback) => {
	let project = {
		name: '$name',
		operator_id: '$operator_id',
		contact_position: '$contact_position',
		contact_address: '$contact_address',
		email: '$email',
		contactNumber: '$contactNumber',
		isActive: '$isActive.status'
	};
	if (status === 'all') {
		User.aggregate([
			{
				$match: {
					$or: [ { 'roles.role_name': 'operator' }, { 'roles.role_name': 'qa' } ]
				}
			},
			{ $project: project },
			{ $match: searchCondition }
		])
			.sort(sortCondition)
			.skip(pageNo * limit)
			.limit(limit)
			.exec(callback);
	} else {
		User.aggregate([
			{
				$match: {
					$or: [ { 'roles.role_name': 'operator' }, { 'roles.role_name': 'qa' } ]
				}
			},
			{ $match: { 'isActive.status': status } },
			{ $project: project },
			{ $match: searchCondition }
		])
			.sort(sortCondition)
			.skip(pageNo * limit)
			.limit(limit)
			.exec(callback);
	}
};

/**
 * Method to get user by its id.
 * @param newUser
 * @param callback
 */
User.getUserByUserId = (id, callback) => {
	User.findOne({ _id: ObjectId(id) }, callback);
};

/**
 * Method to check for the duplicate contact# entry
 * @param newUser
 * @param callback
 */
User.checkPhoneDuplicacy = (email, contactNumber, callback) => {
	User.findOne({ $and: [ { contactNumber }, { email: { $ne: email } } ] }, callback);
};

/**
 * Method to toggle the client for activation or deactivation
 * @param _id
 * @param status
 * @param callback
 */
User.toggleActivation = async (_id, status) => {
	try {
		return await User.findByIdAndUpdate(_id, {
			$set: { isActive: status, 'isActive.action_date': new Date() }
		});
	} catch (err) {
		return Promise.reject(err);
	}
};

User.getAdmin = (callback) => {
	User.findOne({ isAdmin: true }, callback);
};

module.exports = User;

import Mongoose from 'mongoose';

// Verification code schema
var VerificationCodeSchema = Mongoose.Schema(
	{
		user_id: {
			type: Mongoose.Schema.ObjectId,
			ref: 'User'
		},
		email: {
			type: String,
			required: true,
			unique: true,
			email: true
		},
		verificationCode: {
			type: String
		}
	},
	{ timestamps: true }
);

var verification_code = Mongoose.model('verification_code', VerificationCodeSchema);

/**
 * Method to create verification code
 * @param newCode
 * @param callback
 */
verification_code.createCode = (newCode, callback) => {
	newCode.save(callback);
};

/**
 * Method to get verification code details by  user id.
 * @param id
 * @param callback
 */
verification_code.getCodeDetailsByUserId = (id, callback) => {
	verification_code.findOne({ user_id: id }, callback);
};

/**
 * method to get user by verification token and email.
 * @param tokenCode
 * @param callback
 */
verification_code.getUserByCodeAndEmail = (tokenCode, email, callback) => {
	verification_code.findOne({ verificationCode: tokenCode, email: email }, callback);
};

/**
 * method to get user by its email.
 * @param tokenCode
 * @param callback
 */
verification_code.getCodeDetailsByUserEmail = (email, callback) => {
	verification_code.findOne({ email: email }, callback);
};

/**
 * method to get document by its verification code.
 * @param tokenCode
 * @param callback
 */
verification_code.getCodeDetailsByCode = (code, callback) => {
	verification_code.findOne({ verificationCode: code }, callback);
};

export default verification_code;

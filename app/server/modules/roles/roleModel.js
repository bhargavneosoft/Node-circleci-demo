import Mongoose from 'mongoose';

/*
 Role schema
 */
var roleSchema = Mongoose.Schema(
	{
		name: {
			type: String
		}
	},
	{ timestamps: true }
);

var Role = Mongoose.model('Role', roleSchema);

/**
 * Method to create new role.
 * @param newRole
 * @param callback
 */
Role.createRole = (docs, callback) => {
	Role.collection.insertMany(docs, { multi: true }, callback);
};

/**
 * Method to get role by id.
 * @param id
 * @param callback
 */
Role.getRoleById = (id, callback) => {
	Role.findOne({ _id: id }, callback);
};

/**
 * Method  to get all roles.
 * @param callback
 */
Role.getAllRoles = (callback) => {
	Role.find({}, callback);
};

/**
 * Method to  get admin role details.
 * @param callback
 */
Role.getRoleByName = (role, callback) => {
	Role.findOne({ name: role }, callback);
};

/**
 * Method to  get admin role details.
 * @param callback
 */
Role.getAdminRole = (callback) => {
	Role.findOne({ name: 'admin' }, callback);
};

/**
 * Method to  get client role details.
 * @param callback
 */
Role.getClientRole = (callback) => {
	Role.findOne({ name: 'client' }, callback);
};
export default Role;

var Mongoose = require('mongoose'),
	ObjectId = Mongoose.Types.ObjectId;
import constant from '../../helpers/function-constant';

var ASNSchema = new Mongoose.Schema(
	{
		type: {
			type: String
		},
		reference_number: {
			type: String
		},
		inbound_received: {
			type: String,
			enum: [ constant.PENDING, constant.CONFIRMED ],
			default: constant.PENDING
		},
		data_qa: {
			data_entry_user: {
				type: String,
				default: '',
				trim: true
			},
			data_entry_datetime: {
				type: Date
			},
			data_entry_event_number: {
				type: String,
				default: '' //EN#00000009
			},
			inbound_received_user: {
				type: Mongoose.Schema.ObjectId,
				ref: 'User' // operationID
			},
			inbound_received_datetime: {
				type: Date
			}
		},
		data: {
			client_name: {
				type: String,
				default: ''
			},
			inbound_expected_first_notification_date: {
				type: Date,
				default: null
			},
			inbound_expected_eta: {
				type: String,
				default: ''
			},
			study_number: {
				type: String,
				default: ''
			},
			expected_inbound_product_descriptions_list: {
				type: String,
				default: ''
			},
			expected_inbound_number_shippers: {
				type: String,
				default: ''
			},
			sender: {
				type: String,
				default: ''
			},
			inbound_courier: {
				type: String,
				default: ''
			},
			inbound_awb: {
				type: String,
				default: ''
			},
			inbound_shipping_temperature: {
				type: String,
				default: ''
			},
			inbound_storage_temperature: {
				type: String,
				default: ''
			},
			client_comments: {
				type: String,
				default: ''
			},
			client_communication_number: {
				type: String,
				default: ''
			},
			client_communication_number_comments: {
				type: String,
				default: ''
			},
			operator_comments: [],
			supervisor_comments: [],
			cir_reference: {
				type: String,
				default: ''
			},
			flags: {
				eq_flags: {
					eq_flag_1: {
						status: { type: String, enum: [ constant.ON, constant.OFF ] },
						comments: { type: String, default: '' }
					},
					eq_flag_2: {
						status: { type: String, enum: [ constant.ON, constant.OFF ] },
						comments: { type: String, default: '' }
					}
				},
				miscellaneous_flags: {
					flag_1: {
						status: { type: String, enum: [ constant.ON, constant.OFF ] },
						code: { type: String, default: '' },
						comments: { type: String, default: '' }
					},
					flag_2: {
						status: { type: String, enum: [ constant.ON, constant.OFF ] },
						code: { type: String, default: '' },
						comments: { type: String, default: '' }
					},
					flag_3: {
						status: { type: String, enum: [ constant.ON, constant.OFF ] },
						code: { type: String, default: '' },
						comments: { type: String, default: '' }
					}
				}
			}
		},
		objects: {
			ir: [], // fn4
			ncl: [] //fn5
		},
		active: {
			type: String,
			enum: [ constant.ACTIVE, constant.INACTIVE ],
			default: constant.INACTIVE
		}
	},
	{ timestamps: true }
);

var ASNModel = Mongoose.model('asn_detail', ASNSchema);

module.exports = ASNModel;

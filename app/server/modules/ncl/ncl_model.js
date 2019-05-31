var Mongoose = require('mongoose'),
	ObjectId = Mongoose.Types.ObjectId;
import constant from '../../helpers/function-constant';

var NCL_Schema = new Mongoose.Schema(
	{
		reference_number: {
			type: String,
			default: '' // NCL#00000001
		},
		ir_id: {
			type: Mongoose.Schema.ObjectId,
			ref: 'inboundReceipt'
		},
		ctos_id: {
			type: Mongoose.Schema.ObjectId,
			ref: 'ctos'
		},
		type: {
			type: String,
			default: ''
		},
		data_qa: {
			data_entry_user: {
				type: Mongoose.Schema.ObjectId,
				ref: 'User' // operatorId
			},
			data_entry_datetime: {
				type: Date
			},
			data_entry_event_number: {
				type: String,
				default: ''
			},
			qa_user: {
				type: Mongoose.Schema.ObjectId,
				ref: 'User'
			},
			qa_status: {
				type: String,
				enum: [ constant.PASSED, constant.FAILED, constant.PENDING ],
				default: constant.PENDING
			},
			qa_comments: {
				type: String,
				default: '',
				maxlength: 256,
				trim: true
			},
			qa_datetime: {
				type: Date
			},
			qa_event_number: {
				type: String,
				default: ''
			}
		},
		data: {
			asn: {
				type: Array,
				default: []
			},
			study_number: {
				type: String,
				default: ''
			},
			study_number_comments: {
				type: String,
				default: ''
			},
			product_description: {
				type: String,
				default: ''
			},
			product_description_comments: {
				type: String,
				default: ''
			},
			ncl_type: {
				type: String,
				enum: [ constant.ELECTRONIC_TEMPLATE, constant.PHYSICAL ]
			},
			electronic_NCL_details: {
				test_prints: {
					type: String,
					enum: [ constant.PASSED, constant.FAILED, constant.NA ]
				},
				file_name: {
					type: String,
					default: ''
				},
				file_location: {
					type: String,
					default: ''
				}
			},
			physical_NCL_details: {
				ncl_received_in_good_physical_order: {
					type: String,
					enum: [ constant.PASSED, constant.FAILED, constant.NA ]
				},
				product_storage_temperature: {
					type: String,
					default: ''
				},
				product_storage_location: {
					type: String,
					default: ''
				}
			},
			site_number: {
				type: String,
				default: ''
			},
			site_name: {
				type: String,
				default: ''
			},
			non_critical_label_desc: {
				type: String,
				default: ''
			},
			ncl_sender_name: {
				type: String,
				default: ''
			},
			ncl_sender_date: {
				type: Date
			},
			ncl_sender_time: {
				type: Date
			},
			ncl_received_comments: {
				type: String,
				default: ''
			},
			f5_client_communication_num: {
				type: String,
				default: ''
			},
			f5_client_communication_num_comment: {
				type: String,
				default: ''
			},
			operator_comment: [],
			supervisor_comments: [],
			cir_reference: {
				type: String,
				default: ''
			},
			flags: {
				process_flag_1: {
					flag_id: { type: String },
					comments: { type: String, default: '' }
				},
				process_flag_2: {
					flag_id: { type: String },
					comments: { type: String, default: '' }
				},
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

NCL_Schema.virtual('InboundReceipt', {
	ref: 'inboundReceipt',
	localField: 'ir_no',
	foreignField: '_id',
	justOne: true
});

NCL_Schema.set('toObject', { virtuals: true });
NCL_Schema.set('toJSON', { virtuals: true });

var NCL = Mongoose.model('ncl', NCL_Schema);

module.exports = NCL;

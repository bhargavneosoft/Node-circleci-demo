var Mongoose = require('mongoose');
const ObjectId = Mongoose.Types.ObjectId;
import constant from '../../helpers/function-constant';

var inboundReceiptSchema = new Mongoose.Schema(
	{
		type: {
			type: String
		},
		reference_number: {
			type: String,
			default: ''
		},
		data_4_1: {
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
			asn: {
				type: String,
				default: ''
			},
			inbound_received_datetime: {
				type: Date,
				default: null
			},
			sender: {
				type: String
			},
			inbound_courier: {
				type: String
			},
			inbound_AWB: {
				type: String
			},
			inbound_shipping_temp: {
				type: String
			},
			inbound_storage_temp: {
				type: String
			},
			special_transport_container_received: {
				type: String,
				enum: [ constant.YES, constant.NO ]
			},
			special_transport_container_type: {
				type: String,
				default: ''
			},
			special_transport_container_temp: {
				type: String,
				default: ''
			},
			outerbox_number: {
				type: String
			},
			outer_boxes: {},

			number_of_ir_labels: {
				type: String
			},
			outer_box_received_good_condition: {
				type: String,
				enum: [ constant.YES, constant.NO ]
			},
			inbound_received_comments: {
				type: String,
				maxlength: 256,
				default: ''
			},
			department_code: {
				type: String
			},
			client_comments: {
				type: Array,
				default: []
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
		data_4_2: {
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
			client_name: {
				type: String
			},
			study_name: {
				type: String
			},
			list_of_product_descriptions_received: {
				type: String
			},
			client_returns_goods_number: {
				type: String,
				default: ''
			},
			client_returns_site_number: {
				type: String,
				default: ''
			},
			client_returns_site_name: {
				type: String,
				default: ''
			},
			total_weight: {
				type: String
			},
			outer_boxes: {},
			client_inbound_shipping_documents_received: {
				type: String,
				enum: [ constant.YES, constant.NO ]
			},
			outer_non_serialised_tamper_seal_present: {
				type: String,
				enum: [ constant.YES, constant.NO, constant.NA ]
			},
			outer_non_serialised_tamper_seal: {
				number_of_tamper_seal: {
					type: String,
					default: ''
				},
				tampered: {
					type: String,
					enum: [ constant.YES, constant.NO ]
				},
				comments: {
					type: Array,
					default: []
				}
			},
			inner_non_serialised_tamper_seal_present: {
				type: String,
				enum: [ constant.YES, constant.NO, constant.NA ]
			},
			inner_non_serialised_tamper_seal: {
				number_of_tamper_seal: {
					type: String,
					default: ''
				},
				tampered: {
					type: String,
					enum: [ constant.YES, constant.NO ]
				},
				comments: {
					type: Array,
					default: []
				}
			},
			outer_serialised_tamper_seals_present: {
				type: String,
				enum: [ constant.YES, constant.NO, constant.NA ]
			},
			outer_serialised_tamper_seals_number: {
				type: String,
				default: ''
			},
			outer_serialised_tamper_seals: [
				{
					seal_id: {
						type: String,
						default: null
					},
					tampered: {
						type: String,
						enum: [ constant.YES, constant.NO ]
					},
					comments: {
						type: Array,
						default: []
					}
				}
			],

			inner_serialised_tamper_seals_present: {
				type: String,
				enum: [ constant.YES, constant.NO, constant.NA ]
			},
			inner_serialised_tamper_seals_number: {
				type: String,
				default: ''
			},
			inner_serialised_tamper_seals: [
				{
					seal_id: {
						type: String,
						default: null
					},
					tampered: {
						type: String,
						enum: [ constant.YES, constant.NO ]
					},
					comments: {
						type: Array,
						default: []
					}
				}
			],
			external_temperature_device_included: {
				type: String,
				enum: [ constant.YES, constant.NO, constant.NA ]
			},
			external_temperature_device_number: {
				type: String,
				default: ''
			},
			external_temperature_device: [
				{
					box_number: {
						type: String,
						default: ''
					},
					device_id: {
						type: String,
						default: ''
					},
					is_alarmed: {
						type: String,
						enum: [ constant.YES, constant.NO ]
					},
					comments: {
						type: Array,
						default: []
					},
					stopped_read_by: {
						type: String,
						default: ''
					},
					stopped_date: {
						type: String
					},
					stopped_time: {
						type: String
					},
					downloaded_by: {
						type: String,
						default: ''
					}
				}
			],
			internal_temperature_device_included: {
				type: String,
				enum: [ constant.YES, constant.NO, constant.NA ]
			},
			internal_temperature_device_number: {
				type: String,
				default: ''
			},
			internal_temperature_device: [
				{
					box_number: {
						type: String,
						default: ''
					},
					device_id: {
						type: String,
						default: ''
					},
					is_alarmed: {
						type: String,
						enum: [ constant.YES, constant.NO ]
					},
					comments: {
						type: String,
						default: ''
					},
					stopped_read_by: {
						type: String,
						default: ''
					},
					stopped_date: {
						type: String
					},
					stopped_time: {
						type: Date
					},
					downloaded_by: {
						type: String,
						default: ''
					}
				}
			],
			inbound_rationale: {
				type: String,
				enum: [ constant.PASSED, constant.PENDING ]
			},
			inbound_class_material: {
				type: String,
				enum: [ constant.PASSED, constant.PENDING ]
			},
			product_item_code: {
				type: String
			},
			product_storage_location: {
				type: String,
				default: ''
			},
			product_storage_temp: {
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
						status: { type: String, enum: [ constant.YES, constant.NO ] },
						comments: { type: String, default: '' }
					},
					eq_flag_2: {
						status: { type: String, enum: [ constant.YES, constant.NO ] },
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
			asn: [], //fn3
			ncl: {
				type: String,
				default: '' //fn5
			},
			ctos: {
				type: String,
				default: ''
			}
		},
		active: {
			type: String,
			enum: [ constant.ACTIVE, constant.INACTIVE ],
			default: constant.INACTIVE
		}
	},
	{ timestamps: true }
);

inboundReceiptSchema.virtual('CTOS', {
	ref: 'ctos',
	localField: 'ctos_id',
	foreignField: '_id',
	justOne: true
});

inboundReceiptSchema.set('toObject', { virtuals: true });
inboundReceiptSchema.set('toJSON', { virtuals: true });

var inboundReceipt = Mongoose.model('inboundReceipt', inboundReceiptSchema);

module.exports = inboundReceipt;

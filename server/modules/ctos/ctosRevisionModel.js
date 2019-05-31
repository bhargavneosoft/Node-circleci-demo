import { Schema, model } from 'mongoose';
var Mongoose = require('mongoose');
import constant from '../../helpers/function-constant';

/*
 CTOS Schema
*/
const ctosRevisionSchema = new Schema(
	{
		type: {
			type: String,
			default: ''
		},
		reference_id: {
			type: Mongoose.Schema.ObjectId,
			ref: 'ctos' // mongo_object => CTOS#0000000001
		},
		client_revision_id: {
			type: Mongoose.Schema.ObjectId,
			ref: 'revision'
		},
		reference_number: {
			type: String,
			default: '' // CTOS#0000000001
		},
		revision_number: {
			type: Number,
			default: 0
		},
		active: {
			type: String,
			enum: [ constant.ACTIVE, constant.INACTIVE ],
			default: constant.INACTIVE
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
			is_contract_executed: {
				type: String,
				enum: [ constant.YES, constant.PENDING ],
				default: constant.PENDING
			},
			client_reference_number: {
				type: String,
				default: '' // CR#0000000001
			},
			client_name: {
				type: String,
				default: ''
			},
			study_number: {
				type: String,
				default: ''
			},
			study_name: {
				type: String,
				default: ''
			},
			study_description: {
				type: String,
				default: ''
			},
			study_type: {
				type: String,
				default: ''
			},
			study_start_date: {
				type: Date
			},
			study_duration: {
				type: String,
				default: ''
			},
			list_of_product_names: {
				type: String,
				default: ''
			},
			contact: {
				study: [
					{
						name: {
							type: String,
							trim: true
						},
						position: {
							type: String
						},
						email: {
							type: String
						},
						phone: {
							type: String
						}
					}
				],
				blinded_study: [
					{
						name: {
							type: String,
							trim: true
						},
						position: {
							type: String
						},
						email: {
							type: String
						},
						phone: {
							type: String
						}
					}
				],
				unblinded_study: [
					{
						name: {
							type: String,
							trim: true
						},
						position: {
							type: String
						},
						email: {
							type: String
						},
						phone: {
							type: String
						}
					}
				],
				storage_excursion: [
					{
						name: {
							type: String,
							trim: true
						},
						position: {
							type: String
						},
						email: {
							type: String
						},
						phone: {
							type: String
						}
					}
				],
				inbound: [
					{
						name: {
							type: String,
							trim: true
						},
						position: {
							type: String
						},
						email: {
							type: String
						},
						phone: {
							type: String
						}
					}
				],
				outbound: [
					{
						name: {
							type: String,
							trim: true
						},
						position: {
							type: String
						},
						email: {
							type: String
						},
						phone: {
							type: String
						}
					}
				],
				returns: [
					{
						name: {
							type: String,
							trim: true
						},
						position: {
							type: String
						},
						email: {
							type: String
						},
						phone: {
							type: String
						}
					}
				],
				destructions: [
					{
						name: {
							type: String,
							trim: true
						},
						position: {
							type: String
						},
						email: {
							type: String
						},
						phone: {
							type: String
						}
					}
				],
				secondary_labeling: [
					{
						name: {
							type: String,
							trim: true
						},
						position: {
							type: String
						},
						email: {
							type: String
						},
						phone: {
							type: String
						}
					}
				],
				reporting: [
					{
						name: {
							type: String,
							trim: true
						},
						position: {
							type: String
						},
						email: {
							type: String
						},
						phone: {
							type: String
						}
					}
				],
				report_package_ctls: {
					type: Boolean
				},
				report_package_ctls_info: {
					ivrs_name: {
						type: String,
						maxlength: 256,
						default: ''
					},
					ivrs_login_ctls: {
						type: String,
						enum: [ 'YES', 'NO', 'Pending' ]
					},
					ivrs_workshop: {
						type: String,
						enum: [ 'YES', 'NO', 'Pending' ]
					}
				},
				is_complete: {
					type: Boolean,
					default: false
				}
			},
			product_info: {
				product_type: {
					type: String,
					enum: [
						'Investigational Product (IP)',
						'Ancillary Product',
						'Comparator',
						'Clinical Supplies',
						'Commercial',
						'Other'
					]
				},
				product_name: {
					type: String,
					default: ''
				},
				product_description: {
					type: String,
					default: ''
				},
				product_dimension: {
					type: String,
					default: ''
				},
				is_product_kit_individual_component: {
					type: String,
					enum: [ constant.YES, constant.NO, constant.PENDING ]
				},
				specific_instruction_for_individual_component: {
					type: String,
					default: ''
				},
				client_determined_storage_temp: {
					type: String,
					default: ''
				},
				ctls_designated_storage_temp: {
					type: String,
					default: ''
				},
				is_segregated_storage_required_if_frozen: {
					type: String,
					enum: [ 'Segregated Product', 'Co-located Product', constant.PENDING ]
				},
				storage_temperature_excursion_limit: {
					high_temperature: {
						type: String,
						default: ''
					},
					low_temperature: {
						type: String,
						default: ''
					},
					max_execution_time: {
						type: String,
						default: ''
					},
					min_excursion_time: {
						type: String,
						default: ''
					}
				},
				estimated_storage_quantity: {
					type: String,
					default: ''
				},
				specific_instruction_for_storage: {
					type: String,
					default: ''
				},
				max_exposure_time_outside_storage_temperature: {
					type: String,
					default: ''
				},
				coa_ctls: {
					type: String,
					enum: [ constant.YES, constant.NA, constant.PENDING ]
				},
				batch_ctls: {
					type: String,
					enum: [ constant.YES, constant.NA, constant.PENDING ]
				},
				ctn_ctls: {
					type: String,
					enum: [ constant.YES, constant.NA, constant.PENDING ]
				},
				msds_ctls: {
					type: String,
					enum: [ constant.YES, constant.NA, constant.PENDING ]
				},
				is_product_DG: {
					type: String,
					enum: [ constant.YES, constant.NO, constant.PENDING ]
				},
				is_product_DG_info: {
					un_number: {
						type: String,
						maxlength: 256
					},
					class: {
						type: String,
						maxlength: 256
					},
					packing_group: {
						type: String,
						maxlength: 256
					}
				},
				is_product_cytotoxic: {
					type: String,
					enum: [ constant.YES, constant.NO, constant.PENDING ]
				},
				specific_instruction_for_cytotoxic: {
					type: String,
					maxlength: 256
				},
				is_product_radioactive: {
					type: String,
					enum: [ constant.YES, constant.NO, constant.PENDING ]
				},
				specific_instruction_for_radioactive: {
					type: String,
					maxlength: 256
				},
				is_product_gmo: {
					type: String,
					enum: [ constant.YES, constant.NO, constant.PENDING ]
				},
				specific_instruction_for_gmo: {
					type: String,
					maxlength: 256
				},
				is_boilogical_product: {
					type: String,
					enum: [ constant.YES, constant.NO ]
				},
				is_product_imported_australia: {
					type: String,
					enum: [ constant.YES, constant.NO ]
				},
				product_imported_australia_info: {
					import_quarantine_detail: {
						type: String,
						maxlength: 256,
						default: ''
					},
					is_import_permit_supplied_ctls: {
						type: String,
						enum: [ constant.YES, constant.PENDING ]
					},
					permit_number: {
						type: String
					},
					permit_validity: {
						type: String,
						default: ''
					},
					permit_conditions: {
						type: String,
						default: ''
					}
				},
				schedule_of_product: {
					type: String,
					default: ''
				},
				is_schedule_4d: {
					type: String,
					enum: [ constant.YES, constant.NO ]
				},
				is_schedule_4d_info: {
					import_license_applicaiton: {
						type: String,
						enum: [ constant.YES, constant.PENDING ]
					},
					import_permit_application: {
						type: String,
						enum: [ constant.YES, constant.PENDING ]
					},
					import_license_ctls: {
						type: String,
						maxlength: 256,
						default: ''
					},
					import_license_number: {
						type: String,
						maxlength: 256,
						default: ''
					},
					import_license_validity: {
						type: Date
					},
					import_permit_ctls: {
						type: String,
						maxlength: 256,
						default: ''
					},
					import_permit_number: {
						type: String,
						maxlength: 256,
						default: ''
					},
					import_permit_validity: {
						type: Date
					}
				},
				is_5G5H_product_import: {
					type: String,
					enum: [ constant.YES, constant.NO ]
				},
				is_5g_product_info: {
					import_permit_application: {
						type: String,
						maxlength: 256,
						default: ''
					},
					import_permit_ctls: {
						type: String,
						enum: [ constant.YES, constant.PENDING ]
					},
					import_permit_number: {
						type: String,
						maxlength: 256,
						default: ''
					},
					import_permit_validity: {
						type: Date
					}
				},
				is_schedult8_product_import: {
					type: String,
					enum: [ constant.YES, constant.NO ]
				},
				is_schedult8_product_info: {
					schedult8_import_license_application: {
						type: String,
						enum: [ constant.YES, constant.PENDING ]
					},
					schedult8_import_permit_application: {
						type: String,
						enum: [ constant.YES, constant.PENDING ]
					},
					schedult8_import_license_ctls: {
						type: String,
						maxlength: 256,
						default: ''
					},
					schedult8_import_license_number: {
						type: String,
						maxlength: 256,
						default: ''
					},
					schedult8_import_license_validity_date: {
						type: Date
					},
					schedult8_import_permit_ctls: {
						type: String,
						maxlength: 256,
						default: ''
					},
					schedult8_import_permit_number: {
						type: String,
						maxlength: 256,
						default: ''
					},
					schedult8_import_permit_validity_date: {
						type: Date
					}
				},
				is_complete: {
					type: Boolean,
					default: false
				}
			},
			inbound: {
				bulk_replenishments_depot_frequency: {
					type: String,
					default: ''
				},
				estimated_bulk_shipments_depot: {
					type: String,
					default: ''
				},
				expected_first_shipments_depot: {
					type: Date
				},
				customer_clearance_By: {
					type: String
				},
				required_shipping_documents: {
					type: String,
					default: ''
				},
				shipping_temperature: {
					type: String,
					default: ''
				},
				temperature_device_specific_instruction: {
					type: String,
					default: ''
				},
				quarantine_status_required_by_client: {
					type: String,
					enum: [ constant.YES, constant.NO ]
				},
				inbound_quarantine_specific_instruction: {
					type: String,
					default: ''
				},
				retention_samples_retained: {
					type: String,
					enum: [ 'Per Batch', 'Per Inbound', constant.NA ]
				},
				retention_samples_info: {
					quantity_to_be_stored: {
						type: String
					},
					duration_to_store: {
						type: String
					},
					specific_instructions: {
						type: String,
						maxlength: 256,
						default: ''
					}
				},
				is_IVRS_required_to_be_updated: {
					type: String,
					enum: [ constant.YES, constant.NO ]
				},
				required_confirming_documents: {
					type: String,
					default: ''
				},
				inbound_quarantine_instruction: {
					type: String,
					default: ''
				},
				is_complete: {
					type: Boolean,
					default: false
				}
			},
			outbound: {
				supplied_contact_sites_list_to_ctls: {
					type: String,
					enum: [ constant.YES, constant.PENDING, constant.NO ]
				},
				num_of_aus_sites: {
					type: String
				},
				number_of_nz_site: {
					type: String
				},
				SCOTTS_approval_supplied_to_ctls: {
					type: String,
					enum: [ constant.YES, constant.PENDING, constant.NO ]
				},
				num_of_other_international_sites: {
					type: String
				},
				estimated_number_of_outbound_shipped: {
					type: String,
					default: ''
				},
				type_of_order_request_raised: {
					type: String,
					enum: [ 'IVRS', 'Manual Form Via Email', constant.PENDING ]
				},
				type_of_order_request_raised_info: {
					authorised_name_1: {
						type: String,
						maxlength: 256
					},
					contact_position_1: {
						type: String,
						maxlength: 256
					},
					contact_email_1: {
						type: String,
						maxlength: 256
					},
					contact_number_1: {
						type: String,
						maxlength: 256
					},
					contact_number_blinded_2: {
						type: String,
						maxlength: 256
					},
					contact_position_2: {
						type: String,
						maxlength: 256
					},
					contact_email_2: {
						type: String,
						maxlength: 256
					},
					contact_number_2: {
						type: String,
						maxlength: 256
					}
				},
				client_packaging_supplied_to_ctls: {
					type: String,
					enum: [ constant.YES, constant.NO, constant.PENDING ]
				},
				client_packaging_supplied_ctls_info: {
					type_of_ctls: {
						type: String,
						maxlength: 256
					},
					shipper_type_instruction: {
						type: String,
						maxlength: 256
					},
					is_supplied_ctls: {
						type: String,
						enum: [ constant.YES, constant.NO ]
					},
					winter_date_range: {
						type: Date
					},
					summer_date_range: {
						type: Date
					},
					is_report_supplied_ctls: {
						type: String,
						enum: [ constant.YES, constant.NO ]
					},
					allow_transist_time: {
						type: String,
						maxlength: 256
					},
					ctls_quantity: {
						type: String,
						maxlength: 256
					},
					ctls_trigger_level: {
						type: String,
						maxlength: 256
					},
					packaging_stoage_instructions: {
						type: String,
						maxlength: 256
					}
				},

				package_supplied_ctls: {
					type: String,
					enum: [ constant.YES, constant.NO, constant.PENDING ]
				},
				package_supplied_ctls_info: {
					type_of_ctls: {
						type: String,
						maxlength: 256
					},
					shipper_type_instruction: {
						type: String,
						maxlength: 256
					},
					packout_diagram: {
						type: String,
						enum: [ constant.YES, constant.NO ]
					},
					ctls_winter_date: {
						type: Date
					},
					ctls_summer_date: {
						type: Date
					},
					qualification_report: {
						type: String,
						enum: [ constant.YES, constant.NO ]
					},
					package_allowable_time: {
						type: String,
						maxlength: 256
					},
					approved_ctls_package: {
						type: String,
						maxlength: 256
					}
				},
				is_temperature_device_required: {
					type: String,
					enum: [ constant.YES, constant.NO, constant.PENDING ]
				},
				temperature_device_required_info: {
					type_of_temprature_device: {
						type: String,
						maxlength: 256
					},
					temperature_device_client: {
						type: String,
						enum: [ constant.YES, constant.NO ]
					},
					temperature_device_by_client_quantity_supplied: {
						type: String,
						maxlength: 256
					},
					temperature_device_supplied_by_ctls: {
						type: String,
						enum: [ constant.YES, constant.NO ]
					},
					temperature_device_by_ctls_quantity_supplied: {
						type: String,
						maxlength: 256
					},
					temperature_device_trigger_level: {
						type: String,
						maxlength: 256
					},
					device_storage_temperature: {
						type: String,
						maxlength: 256
					},
					temperature_device_low_setpoint: {
						type: String,
						maxlength: 256
					},
					temperature_device_high_setpoint: {
						type: String,
						maxlength: 256
					},
					temperature_device_delay_start_setpoint: {
						type: String,
						maxlength: 256
					},
					temperature_device_interval_start_setpoint: {
						type: String,
						maxlength: 256
					},
					configure_device_temperature: {
						type: String,
						maxlength: 256
					},
					alarmed_temperature: {
						type: String,
						maxlength: 256
					},
					temperature_device_instruction: {
						type: String,
						enum: [ constant.YES, constant.NO, constant.PENDING ]
					}
				},
				copacked_product_description: {
					type: String,
					default: ''
				},
				shipment_courier_used: {
					type: String,
					default: ''
				},
				courier_account_no: {
					type: String
				},
				shipping_temperature_to_be_specified: {
					type: String,
					default: ''
				},
				secondary_labeling_requirement: {
					type: String
				},
				specific_labeling_requirement: {
					type: String
				},
				shipment_documents_required: {
					type: String,
					default: ''
				},
				ivrs_outbound_confirmation: {
					type: String,
					enum: [ constant.YES, constant.NO ]
				},
				required_confirming_documents: {
					type: String,
					default: ''
				},
				specific_instructions: {
					type: String,
					default: ''
				},
				is_aor_required: {
					type: String,
					enum: [ constant.YES, constant.NO ]
				},
				aor_instruction: {
					type: String,
					maxlength: 256
				},
				days_of_expiry: {
					type: String
				},
				quarantine_status_for_expired_products: {
					type: String,
					enum: [ constant.YES, constant.NO, constant.PENDING ]
				},
				instructions_for_expired_products: {
					type: String
				},
				is_complete: {
					type: Boolean,
					default: false
				}
			},
			return_to_ctls: {
				is_site_return_expected: {
					type: String,
					enum: [ constant.YES, constant.PENDING, constant.NO ]
				},
				is_ctls_required_in_booking: {
					type: String,
					enum: [ constant.YES, constant.NO ]
				},
				is_ctls_required_in_packaging: {
					type: String,
					enum: [ constant.YES, constant.NO ]
				},
				packaging_instruction: {
					type: String
				},
				level_1_returns: {
					type: String,
					enum: [ constant.YES, constant.NO ]
				},
				level_2_returns: {
					type: String,
					enum: [ constant.YES, constant.NO ]
				},
				storage_temperature_client_determined: {
					type: String,
					default: ''
				},
				storage_temperature_ctls_designated: {
					type: String,
					default: ''
				},
				final_desposition: {
					type: String
				},
				shipping_documents_required: {
					type: String
				},
				ivrs_receipt: {
					type: String,
					enum: [ constant.YES, constant.NO ]
				},
				required_document_to_email: {
					type: String,
					default: ''
				},
				specific_instruction: {
					type: String,
					default: ''
				},
				is_complete: {
					type: Boolean,
					default: false
				}
			},
			destruction: {
				is_rotational_preApproved: {
					type: String,
					enum: [ constant.YES, constant.NO ]
				},
				is_final_destruction_approval_required: {
					type: String,
					enum: [ constant.YES, constant.NO ]
				},
				is_destruction_material_required: {
					type: String,
					enum: [ constant.YES, constant.NO ]
				},
				is_witness_destruction_required: {
					type: String,
					enum: [ constant.YES, constant.NO ]
				},
				is_IVRS_required: {
					type: String,
					enum: [ constant.YES, constant.NO ]
				},
				documents_required_to_be_sent: {
					type: String
				},
				specific_instruction: {
					type: String
				},
				secondary_labeling: {
					is_activity_anticipated: {
						type: String,
						enum: [ constant.YES, constant.NO, , constant.PENDING ]
					},
					default_quarantine: {
						type: String,
						enum: [ constant.YES, constant.NO ]
					},
					anticipated_type_of_labeling: {
						type: String
					},
					required_documents: {
						type: String,
						default: ''
					},
					specific_instruction_labeling: {
						type: String
					}
				},
				kit_assembly: {
					is_kit_assembly_anticipated: {
						type: String,
						enum: [ constant.YES, constant.NO, constant.PENDING ]
					},
					product_description: {
						type: String
					},
					anticipated_type: {
						type: String
					},
					default_quarantine: {
						type: String,
						enum: [ constant.YES, constant.NO, constant.PENDING ]
					},
					required_documents: {
						type: String
					},
					specific_instruction_kit: {
						type: String
					}
				},
				stoke_take: {
					is_stock_take_required: {
						type: String,
						enum: [ constant.YES, constant.NO ]
					},
					specific_instruction_stock_take: {
						type: String
					}
				},
				types_of_reports_required: {
					type: String
				},
				frequency_of_reports_required: {
					type: String
				},
				instruction_for_reposting: {
					type: String
				},
				specific_WI_supplied_to_client: {
					type: String,
					enum: [ constant.YES, constant.NO ]
				},
				specific_instructions_for_archive_docs: {
					type: String
				},
				is_complete: {
					type: Boolean,
					default: false
				}
			},
			invoice_from_ctls: {
				email_address: {
					type: String
				},
				postal_address: {
					type: String
				},
				client_invoice: {
					type: String
				},
				due_date: {
					type: Date
				},
				invoice_documents: {
					type: String
				},
				invoice_instruction: {
					type: String
				},
				client_general_information: {
					type: String
				},
				client_approval_name: {
					type: String
				},
				client_approval_signature: {
					type: String
				},
				client_approval_date: {
					type: Date
				},
				ctls_approval_name: {
					type: String
				},
				ctls_approval_signature: {
					type: String
				},
				ctls_approval_date: {
					type: Date
				},
				is_complete: {
					type: Boolean,
					default: false
				}
			},
			change_history: {
				change_history_notes: {
					type: String,
					default: ''
				},
				change_history_version_number: {
					type: String
				},
				change_history_date_effective: {
					type: Date
				},
				change_history_client_approval_name: {
					type: String,
					default: ''
				},
				change_history_client_approval_signature: {
					type: String,
					default: ''
				},
				change_history_client_approval_notes: {
					type: String,
					default: ''
				},
				change_history_ctls_approval_name: {
					type: String,
					default: ''
				},
				change_history_ctls_approval_signature: {
					type: String,
					default: ''
				},
				change_history_ctls_approval_notes: {
					type: String,
					default: ''
				},
				change_history_comments: {
					type: String,
					default: ''
				},
				is_complete: {
					type: Boolean,
					default: false
				}
			},
			study_closure: {
				notified_date: {
					type: Date
				},
				ongoing_operational_activities: {
					type: String,
					default: ''
				},
				expected_activity_completion: {
					type: String,
					default: ''
				},
				expected_last_invoice: {
					type: String,
					default: ''
				},
				ongoing_obligations: {
					type: String,
					default: ''
				},
				final_invoice: {
					type: String,
					default: ''
				},
				study_closure_date: {
					type: Date
				},
				comments: {
					type: String
				},
				is_complete: {
					type: Boolean,
					default: false
				}
			},
			ctos_inactive_date: {
				type: Date
			},
			ctos_archive_date: {
				type: Date
			},
			client_communication_number: {
				type: String,
				default: ''
			},
			client_communication_number_comments: {
				type: String,
				default: ''
			},
			cir_reference: {
				type: String,
				default: ''
			},
			operator_comments: { type: Array, default: [] },
			supervisor_comments: { type: Array, default: [] }
		}
	},
	{ timestamps: true }
);

const ctosRevision = model('ctos_revision', ctosRevisionSchema);

export default ctosRevision;

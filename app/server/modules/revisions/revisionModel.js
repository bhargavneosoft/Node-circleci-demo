import Mongoose from 'mongoose';
import constant from '../../helpers/function-constant';

/*
* Revision schema
 */
var revisionsSchema = new Mongoose.Schema(
    {
        type: {
            type: String,
            default: ''
        },
        reference_id: {
            type: Mongoose.Schema.ObjectId,
            ref: 'clients'
        },
        reference_number: {
            type: String,
            default: ''
        },
        revision_number: {
            type: Number,
            default: 0
        },
        active: {
            type: String,
            enum: [constant.ACTIVE, constant.INACTIVE],
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
                enum: [constant.PASSED, constant.FAILED, constant.PENDING],
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
            client_name: {
                type: String,
                default: '',
                trim: true
            },
            client_abn: {
                type: String,
                default: ''
            },
            client_contact_position: {
                type: String,
                maxlength: 50,
                default: '',
                trim: true
            },
            client_contact_address: {
                type: String,
                maxlength: 50,
                default: '',
                trim: true
            },
            client_contact_email: {
                type: String,
                trim: true
            },
            client_contact_number: {
                type: String,
                trim: true
            },
            cda_executed_on: {
                type: Date
            },
            cda_date_effective: {
                type: Date
            },
            cda_term: {
                type: String,
                maxlength: 256,
                trim: true
            },
            cda_review_date: {
                type: Date
            },
            cda_obligations: {
                type: String,
                maxlength: 256,
                trim: true
            },
            cda_comments: {
                type: String,
                maxlength: 256,
                trim: true,
                default: ''
            },
            msa_executed_on: {
                type: Date
            },
            msa_date_effective: {
                type: Date
            },
            msa_term: {
                type: String,
                maxlength: 256
            },
            msa_review_date: {
                type: Date
            },
            msa_obligations: {
                type: String,
                maxlength: 256,
                trim: true
            },
            msa_comments: {
                type: String,
                maxlength: 256,
                trim: true,
                default: ''
            },
            pricing_executed_on: {
                type: Date
            },
            pricing_date_effective: {
                type: Date
            },
            pricing_term: {
                type: String,
                maxlength: 256
            },
            pricing_review_date: {
                type: Date
            },
            pricing_obligations: {
                type: String,
                maxlength: 256,
                trim: true
            },
            pricing_comments: {
                type: String,
                maxlength: 256,
                trim: true,
                default: ''
            },
            amendments_executed_on: {
                type: Date
            },
            amendments_date_effective: {
                type: Date
            },
            amendments_term: {
                type: String,
                maxlength: 256,
                trim: true,
                default: ''
            },
            amendments_review_date: {
                type: Date
            },
            amendments_obligations: {
                type: String,
                maxlength: 256,
                trim: true
            },
            amendments_comments: {
                type: String,
                maxlength: 256,
                trim: true,
                default: ''
            },
            qa_ta_executed_on: {
                type: Date
            },
            qa_ta_date_effective: {
                type: Date
            },
            qa_ta_term: {
                type: String,
                maxlength: 256,
                trim: true,
                default: ''
            },
            qa_ta_review_date: {
                type: Date
            },
            qa_ta_obligations: {
                type: String,
                maxlength: 256,
                trim: true
            },
            qa_ta_comments: {
                type: String,
                maxlength: 256,
                trim: true,
                default: ''
            },
            change_history_notes: {
                type: String,
                maxlength: 256,
                trim: true,
                default: ''
            },
            change_history_date_effective: {
                type: Date
            },
            change_history_client_approval_name: {
                type: String,
                default: '',
                trim: true
            },
            change_history_client_approval_signature: {
                type: String,
                default: ''
            },
            change_history_client_approval_notes: {
                type: String,
                maxlength: 256,
                default: '',
                trim: true
            },
            change_history_ctls_approval_name: {
                type: String,
                default: '',
                trim: true
            },
            change_history_ctls_approval_signature: {
                type: String,
                default: '',
                trim: true,
                trim: true
            },
            change_history_ctls_approval_notes: {
                type: String,
                maxlength: 256,
                default: '',
                trim: true
            },
            change_history_comments: {
                type: String,
                maxlength: 256,
                default: '',
                trim: true
            },
            client_inactive_date: {
                type: Date
            },
            client_archive_date: {
                type: Date
            },
            client_communication_number: {
                type: String,
                default: ''
            },
            client_communication_number_comments: {
                type: String,
                maxlength: 256,
                default: '',
                trim: true
            },
            operator_comments: { type: Array, default: [] },
            supervisor_comments: { type: Array, default: [] },
            cir_reference: {
                type: String,
                default: ''
            },
            management_approval_name: {
                type: String,
                default: '',
                trim: true
            },
            management_approval_date: {
                type: Date
            }
        }
    },
    { timestamps: true }
);

var revision = Mongoose.model('revision', revisionsSchema);

export default revision;

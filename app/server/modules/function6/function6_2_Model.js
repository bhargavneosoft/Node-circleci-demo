var Mongoose = require('mongoose'),
    ObjectId = Mongoose.Types.ObjectId;
import constant from '../../helpers/function-constant';

var Function6_2_Schema = new Mongoose.Schema(
    {
        ctos_id: {
            type: Mongoose.Schema.ObjectId,
            ref: 'ctos_revision'
        },
        ir_id: {
            type: Mongoose.Schema.ObjectId,
            ref: 'inboundReceipt',
            default: null
        },
        function_completed: {
            type: String,
            enum: ['Inbound-Audit', 'Return-Audit', 'Label-Audit']
        },
        client_inbound_order_number: {
            type: String
        },
        ctls_lpa: {
            type: String
        },
        client_label_reference: {
            type: String
        },
        origin_of_shipment: {
            type: String
        },
        number_of_product: {
            type: String
        },
        label_rational: {
            type: String,
            enum: ['Immediate', 'Outer', 'Temper-Seal']
        },
        label_number: {
            type: String
        },
        f6_2_integrity_product: {
            type: String,
            enum: [constant.YES, constant.NO]
        },
        f6_2_product_component_level: {
            type: String,
            enum: [constant.YES, constant.NO]
        },
        f6_2_retention_sample_required: {
            type: String,
            enum: [constant.YES, constant.NO]
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
        status: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

var Function6_2 = Mongoose.model('function6_2', Function6_2_Schema);

module.exports = Function6_2;
var Mongoose = require('mongoose'),
    ObjectId = Mongoose.Types.ObjectId;
import constant from '../../helpers/function-constant';

var Function6_1_Schema = new Mongoose.Schema(
    {
        ctos_id: {
            type: Mongoose.Schema.ObjectId,
            ref: 'ctos_revision'
        },
        CIR_reference: {
            type: String
        },
        operator_comments: [],
        supervisor_comment: [],
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


var Function6_1 = Mongoose.model('function6_1', Function6_1_Schema);

module.exports = Function6_1;
import { Schema, Types, model } from 'mongoose';
var Mongoose = require('mongoose');
import constant from '../../helpers/function-constant';
import Counter from '../counter/counterModel';

/*
 CTOS schema
 */
const ctosSchema = new Schema(
    {
        isNewlyCreatedCTOS: {
            type: Boolean,
            required: true,
            default: true
        },
        revisions: {
            type: Array,
            default: []
        },
        client_id: {
            type: Mongoose.Schema.ObjectId,
            ref: 'clients',
        },
        active: {
            type: String,
            enum: [constant.ACTIVE, constant.INACTIVE],
            default: constant.INACTIVE
        },
        qa_status: {
            type: String,
            enum: [constant.PENDING, constant.PASSED, constant.FAILED],
            default: constant.PENDING
        },
        last_updated: {
            type: Date
        },
        last_updated_id: {
            type: String,
            default: ''
        },
        last_qa: {
            type: Date
        },
        last_qa_id: {
            type: Mongoose.Schema.ObjectId,
            ref: 'User',
            default: null
        }
    },
    { timestamps: true }
);

ctosSchema.pre('save', function (next) {
    let doc = this;
    if (doc.isNewlyCreatedCTOS) {
        Counter.findOneAndUpdate(
            { target: 'target' },
            { $inc: { ctos_number: 1 } },
            { upsert: true, new: true },
            (error, counter) => {
                if (error) return next(error);
                function padDigit(number, digits) {
                    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
                }
                doc.ctos_reference_no = `CTOS#${padDigit(counter.ctos_number, 10)}`;
                doc.isNewlyCreatedCTOS = false;
                next();
            }
        );
    } else {
        next();
    }
});
const ctos = model('ctos', ctosSchema);

export default ctos;

import Mongoose from 'mongoose';
import constant from '../../helpers/function-constant';

/*
 Event Log schema
 */
var eventLogSchema = new Mongoose.Schema(
    {
        type: {
            type: String,
            default: ''
        },
        event_number: {
            type: String
        },
        user_id: {
            type: Mongoose.Schema.ObjectId,
            ref: 'User'
        },
        function: {
            type: String,
            default: ''
        },
        inbound_received: {
            type: String,
            default: ''
        },
        qa_status: {
            type: String,
            enum: [constant.PENDING, constant.PASSED, constant.FAILED],
            default: constant.PENDING
        },
        event_activity: {
            type: String,
            default: ''
        },
        objects: {
            created: {
                type: String,
                default: ''
            },
            linked: {
                type: String,
                default: ''
            },
            qa_passed: {
                type: String,
                default: ''
            },
            updated: {
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

var event_logs = Mongoose.model('event_logs', eventLogSchema);

/**
 * Method to get all the available event_logs
 * @param searchCondition
 * @param callback
 */
event_logs.fetchAllEventsCount = (status, searchCondition, callback) => {
    let project = {
        name: '$user.name',
        reference_no: '$user.reference_number',
        objects: '$objects',
        type: '$type',
        function: '$function',
        status: '$status',
        qa_status: '$qa_status',
        event_number: '$event_number',
        event_activity: '$event_activity',
        contactNumber: '$user.data.client_contact_number',
        createdAt: '$createdAt',
        updatedAt: '$updatedAt',
    };
    let lookup = {
        from: 'users', // name of the model to lookup to
        localField: 'user_id',
        foreignField: '_id',
        as: 'user'
    };

    if (status === 'All') {
        event_logs
            .aggregate([
                { $match: { status: 1 } },
                { $lookup: lookup },
                { $unwind: '$user' },
                { $project: project },
                { $match: searchCondition }
            ])
            .exec(callback);
    } else {
        event_logs
            .aggregate([
                { $match: { status: 1 } },
                { $lookup: lookup },
                { $unwind: '$user' },
                { $project: project },
                { $match: searchCondition }
            ])
            .exec(callback);
    }
};

/**
 * Method to get all the available event_logs
 * @param pageNo
 * @param limit
 * @param status 
 * @param sortCondition
 * @param searchCondition
 * @param callback
 */
event_logs.fetchAllEvents = (pageNo, limit, status, sortCondition, searchCondition, callback) => {
    let project = {
        name: '$user.name',
        reference_no: '$user.reference_number',
        objects: '$objects',
        type: '$type',
        function: '$function',
        qa_status: '$qa_status',
        status: '$status',
        event_number: '$event_number',
        event_activity: '$event_activity',
        createdAt: '$createdAt',
        updatedAt: '$updatedAt',
    };
    let lookup = {
        from: 'users', // name of the model to lookup to
        localField: 'user_id',
        foreignField: '_id',
        as: 'user'
    };

    if (status === 'All') {
        event_logs
            .aggregate([
                { $match: { status: 1 } },
                { $lookup: lookup },
                { $unwind: '$user' },
                { $project: project },
                { $match: searchCondition }
            ])
            .sort(sortCondition)
            .skip(pageNo * limit)
            .limit(limit)
            .exec(callback);
    } else {
        event_logs
            .aggregate([
                { $match: { status: 1 } },
                { $lookup: lookup },
                { $unwind: '$user' },
                { $project: project },
                { $match: searchCondition }
            ])
            .sort(sortCondition)
            .skip(pageNo * limit)
            .limit(limit)
            .exec(callback);
    }
};
export default event_logs;

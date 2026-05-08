import { Schema, model } from "mongoose";

const enrollmentschema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
        index: true,
    },
    status: {
        type: String,
        enum: ['pending','paid', 'failed', 'cancelled'],
        default: 'pending',
    },
    paymentId: {
        type: Schema.Types.ObjectId,
        ref: 'Payment',
    },
    amount:{
        type: Number,
        required: true,
        min: 0,
    },
    orderId:{
        type: String,
        required: true,
        unique: true,
    },
    enrolledAt: {
        type: Date,
        default: Date.now,
    },
    completedAt: {
        type: Date,
    },
    cancelledAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

// one user can enroll in one course
enrollmentschema.index({ userId: 1, courseId: 1 }, { unique: true });

export const Enrollment = model('Enrollment', enrollmentschema);
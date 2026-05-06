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
        enum: ['active', 'completed', 'cancelled'],
        default: 'pending',
    },
    progress: {
        completedLessons: [{
            type: Schema.Types.ObjectId,
            ref: 'Lesson',
        }],
        percentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
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
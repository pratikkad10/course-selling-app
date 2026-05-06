import { Schema } from "mongoose";

const reviewschema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
        },
    comment: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

// one review per user per course
reviewschema.index({ userId: 1, courseId: 1 }, { unique: true });

export const Review = model('Review', reviewschema);
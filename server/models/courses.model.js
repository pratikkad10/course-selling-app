import { Schema, model } from 'mongoose';

const coursesmodel = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 100,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    description: {
        type: String,
        required: true,
    },
    instructorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
    },
    image: {
        type: String,
        required: true,
    },
    categories: [{
        type: String,
        index: true,
    }],
    tags: [{
        type: String,
    }],
    stats: {
        views: {
            type: Number,
            default: 0,
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        totalReviews: {
            type: Number,
            default: 0,
            min: 0,
        },
        totalStudents: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner',
    },
    language: {
        type: String,
        default: 'English',
    },
    isPublished: {
        type: Boolean,
        default: false,
        index: true,
    },
    isFree: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

export const Course = model('Course', coursesmodel);
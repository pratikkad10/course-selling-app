import { Schema, model } from 'mongoose';

const usermodel = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['student', 'instructor', 'admin'],
        default: 'student',
    },
    password: {
        type: String,
        required: true,
    },
    instructorStats: {
        totalStudents: {
            type: Number,
            default: 0,
        },
        totalCourses: {
            type: Number,
            default: 0,
        },
        rating: {
            type: Number,
            default: 0,
        }
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
    },
    verificationTokenExpires: {
        type: Date,
    },
    isBanned: {
        type: Boolean,
        default: false,
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

export const User = model('User', usermodel);
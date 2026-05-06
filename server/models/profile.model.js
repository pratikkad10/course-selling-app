import { Schema } from "mongoose";

const profileschema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    contactNumber: {
        type: String,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
    },
    dateOfBirth: {
        type: Date,
    },
    address: {
        type: String,
    },
    bio: {
        type: String,
    },
    profileImage: {
        type: String,
    },
    socialLinks: {
        facebook: {
            type: String
        },
        twitter: {
            type: String
        },
        instagram: {
            type: String
        },
        linkedin: {
            type: String
        },
    },
}, { timestamps: true }
);

export const Profile = model('Profile', profileschema);
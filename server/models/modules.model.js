import { Schema, model } from "mongoose";
import { minLength } from "zod";

const modulesschema = new Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        minLength: 3,
        maxLength: 100,
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
        index: true,
    },
    order: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});

modulesschema.index({ courseId: 1, order: 1 }, { unique: true });

export const Module = model('Module', modulesschema);
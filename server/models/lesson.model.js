import { Schema, model } from "mongoose";
import { maxLength } from "zod";

const lessonschema = new Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        minLength: 3,
        maxLength: 100,
    },
    videoUrl: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
        min: 0,
    },
    isPreview: {
        type: Boolean,
        default: false,
    },
    isFree: {
        type: Boolean,
        default: false,
    },
    instructorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    moduleId: {
        type: Schema.Types.ObjectId,
        ref: 'Module',
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

//unique ordering within module
lessonschema.index({ moduleId: 1, order: 1 }, { unique: true });

export const Lesson = model('Lesson', lessonschema);
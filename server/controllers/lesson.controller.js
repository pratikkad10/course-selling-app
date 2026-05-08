import { is } from "zod/v4/locales";
import { Lesson } from "../models/lesson.model";
import { lessonValidation, updateLessonValidation } from "../validation/lesson.validation";


export const createLessonController = async (req, res) => {
    try {
        const { moduleId } = req.params;
        if (!moduleId) {
            return res.status(400).json({ error: "Invalid request" });
        }

        const { title, videoUrl, duration, isPreview, isFree, order } = req.body;

        const result = lessonValidation.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        if (!req.user?._id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const lesson = await Lesson.create({
            title,
            videoUrl,
            duration,
            isPreview,
            isFree,
            moduleId,
            instructorId: req.user._id,
            order,
        });

        if (!lesson) {
            return res.status(500).json({ error: "Failed to create lesson" });
        }

        res.status(201).json({ message: "Lesson created successfully", lesson });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateLessonController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Invalid request" });
        }
        const { title, videoUrl, duration, isPreview, isFree, order } = req.body;

        const result = updateLessonValidation.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        const lesson = await Lesson.findOne({
            _id: id,
            instructorId: req.user._id
        });

        if (!lesson) {
            return res.status(404).json({ error: "Lesson not found" });
        }

        if (title !== undefined) lesson.title = title;
        if (videoUrl !== undefined) lesson.videoUrl = videoUrl;
        if (duration !== undefined) lesson.duration = duration;
        if (isPreview !== undefined) lesson.isPreview = isPreview;
        if (isFree !== undefined) lesson.isFree = isFree;
        if (order !== undefined) lesson.order = order;

        await lesson.save();

        res.status(200).json({ message: "Lesson updated successfully", lesson });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteLessonController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Invalid request" });
        }
        if (!req.user?._id) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const lesson = await Lesson.findOneAndDelete({
            _id: id,
            instructorId: req.user._id
        });

        if (!lesson) {
            return res.status(404).json({ error: "Lesson not found" });
        }

        res.status(200).json({ message: "Lesson deleted successfully", lesson });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getLessonController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Invalid request" });
        }
        if (!req.user?._id) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const lesson = await Lesson.findById({
            _id: id,
            instructorId: req.user._id
        });

        if (!lesson) {
            return res.status(404).json({ error: "Lesson not found" });
        }

        res.status(200).json({ message: "Lesson found successfully", lesson });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getLessonsController = async (req, res) => {
    try {
        const { moduleId } = req.params;
        if (!moduleId) {
            return res.status(400).json({ error: "Invalid request" });
        }
        if(!req.user?._id){
            return res.status(401).json({ error: "Unauthorized" });
        }
        const lessons = await Lesson.find({
            moduleId,
            instructorId: req.user._id
        }).select("_id title duration isPreview isFree order");

        if(!lessons){
            return res.status(404).json({ error: "Lessons not found" });
        }

        res.status(200).json({ message: "Lessons found successfully", lessons });

    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Internal server error" });
    }
}
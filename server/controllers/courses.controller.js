import mongoose from "mongoose";
import { Course } from "../models/courses.model.js";
import { Lesson } from "../models/lesson.model.js";
import { Module } from "../models/modules.model.js";
import { courseValidation, updateCourseValidation } from "../validation/course.validation.js";
import { Enrollment } from "../models/enrollment.model.js";
import { en } from "zod/v4/locales";

export const createCourseController = async (req, res) => {
    try {
        const { title, slug, description, price, discount, image, categories, tags, level, language, isPublished, isFree } = req.body;

        const result = courseValidation.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }
        if (!req.user?._id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const instructorId = req.user._id;

        const course = await Course.create({
            title,
            instructorId,
            slug,
            description,
            price,
            discount,
            image,
            categories,
            tags,
            level,
            language,
            isPublished,
            isFree,
        });

        if (!course) {
            return res.status(500).json({ error: "Failed to create course" });
        }

        res.status(201).json({ message: "Course created successfully", course });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getAllCoursesController = async (req, res) => {
    try {
        const courses = await Course.find();
        if (!courses) {
            return res.status(404).json({ error: "No courses found" });
        }
        res.status(200).json(courses);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getCourseByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Invalid request" });
        }
        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }
        res.status(200).json(course);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const updateCourseByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Invalid request" });
        }
        const { title, slug, description, price, discount, image, categories, tags, level, language, isPublished, isFree } = req.body;
        const result = updateCourseValidation.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        const course = await Course.findByIdAndUpdate(
            id,
            result.data,
            {
                new: true,
                runValidators: true,
            }
        );
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const deleteCourseByIdController = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const { id } = req.params;

        if (!id) {
            await session.abortTransaction();

            return res.status(400).json({
                error: "Course id is required"
            });
        }

        // Verify ownership
        const course = await Course.findOne({
            _id: id,
            instructorId: req.user._id
        }).session(session);

        if (!course) {
            await session.abortTransaction();

            return res.status(404).json({
                error: "Course not found"
            });
        }

        // Get all modules of this course
        const modules = await Module.find({
            courseId: id
        }).session(session);

        const moduleIds = modules.map(module => module._id);

        // Delete lessons belonging to modules
        await Lesson.deleteMany({
            moduleId: { $in: moduleIds }
        }).session(session);

        // Delete modules
        await Module.deleteMany({
            courseId: id
        }).session(session);

        // Delete course
        await Course.deleteOne({
            _id: id
        }).session(session);

        await session.commitTransaction();

        res.status(200).json({
            message: "Course deleted successfully"
        });

    } catch (error) {

        await session.abortTransaction();

        console.log(error);

        res.status(500).json({
            error: "Internal server error"
        });

    } finally {
        session.endSession();
    }
};

export const getMyCoursesController = async (req, res) => {
    try {

        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({
                error: "Unauthorized"
            });
        }

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const courses = await Course.find({
            instructorId: userId
        })
            .select("title image description slug isPublished isFree _id price status createdAt")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const totalCourses = await Course.countDocuments({
            instructorId: userId
        });

        res.status(200).json({
            courses,
            currentPage: page,
            totalPages: Math.ceil(totalCourses / limit),
            totalCourses
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Internal server error"
        });
    }
};

//Enroll student in a free course
export const enrollInCourseController = async (req, res) => {
    try {

        const { courseId } = req.params;

        if (!courseId) {
            return res.status(400).json({
                error: "Course ID is required"
            });
        }

        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({
                error: "Unauthorized"
            });
        }

        // find course
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                error: "Course not found"
            });
        }

        // check existing enrollment
        const existingEnrollment = await Enrollment.findOne({
            userId,
            courseId,
            status: {
                $in: ["pending", "failed", "cancelled", "paid"]
            }
        });

        if (existingEnrollment) {
            return res.status(400).json({
                error: "You are already enrolled in this course"
            });
        }

        // paid course cannot use direct enrollment
        if (course.price > 0) {
            return res.status(400).json({
                error: "This is a paid course. Please complete payment first."
            });
        }

        // free course enrollment
        const newEnrollment = await Enrollment.create({
            userId,
            courseId,
            status: "paid"
        });

        res.status(201).json({
            success: true,
            message: "Enrollment successful",
            enrollment: newEnrollment
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Internal server error"
        });
    }
};

export const getEnrolledCoursesController = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const courses = await Enrollment.find({
            userId,
            status: "paid"
        })
            .populate("courseId")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        const totalCourses = await Enrollment.countDocuments({
            userId,
            status: "paid"
        });

        if (!courses || !totalCourses) {
            return res.status(404).json({ error: "No courses found" });
        }

        res.status(200).json({
            courses
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getEnrolledStudentsController = async (req, res) => {
    try {
        const { courseId } = req.params;
        if(!courseId){
            return res.status(400).json({ error: "Invalid request" });
        }

        const students = await Enrollment.find({
            courseId,
            status: "paid"
        })
            .populate("userId")
            .lean();

        if (!students) {
            return res.status(404).json({ error: "No students found" });
        }

        res.status(200).json(students);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}



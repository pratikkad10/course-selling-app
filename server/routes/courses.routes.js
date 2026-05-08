import express from "express";
import { adminAuth, auth, instructorAuth, studentAuth } from "../middlewares/auth.middleware.js";
import { createCourseController, deleteCourseByIdController, getAllCoursesController, getCourseByIdController, updateCourseByIdController } from "../controllers/courses.controller.js";
const router = express.Router();

router.post("/create", auth, instructorAuth, createCourseController);
router.get("/", auth, adminAuth, getAllCoursesController);
router.get("/:id", auth, adminAuth, getCourseByIdController);
router.patch("/:id", auth, instructorAuth, updateCourseByIdController);
router.delete("/:id", auth, instructorAuth, deleteCourseByIdController);
router.get("/my-courses", auth, instructorAuth, getMyCoursesController);
router.post("/enroll/:courseId", auth, studentAuth, enrollInCourseController);
router.get("/enrolled-courses", auth, studentAuth, getEnrolledCoursesController);
router.get("/enrolled-students/:courseId", auth, adminAuth, getEnrolledStudentsController);

export default router;
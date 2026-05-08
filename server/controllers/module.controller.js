import { Course } from "../models/courses.model";
import { Module } from "../models/modules.model";
import { moduleValidation, updateModuleValidation } from "../validation/module.validation";


export const createModuleController = async (req, res) => {
    try {
        const { courseId } = req.params;
        if (!courseId) {
            return res.status(400).json({ error: "Invalid request" });
        };
        const { title, order } = req.body;
        const result = moduleValidation.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.error });
        };
        if (!req.user?._id) {
            return res.status(401).json({ error: "Unauthorized" });
        };
        const course = await Course.findOne({
            _id: courseId,
            instructorId: userId
        });
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        };
        const module = await Module.create({
            title,
            courseId,
            instructorId: req.user._id,
            order,
        });
        if (!module) {
            return res.status(500).json({ error: "Failed to create module" });
        }
        res.status(201).json({ message: "Module created successfully", module });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateModuleController = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "Invalid request" });
        }

        const { title, order } = req.body;

        const result = updateModuleValidation.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        if (!req.user?._id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const module = await Module.findOne({
            _id: id,
            instructorId: req.user._id
        });

        if (title !== undefined) module.title = title;
        if (order !== undefined) module.order = order;

        await module.save();

        res.status(200).json({ message: "Module updated successfully", module });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteModuleController = async (req, res) => {
    try {
        const { id } = req.params;
        if(!id){
            return res.status(400).json({ error: "Invalid request" });
        }
        if (!req.user?._id) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        
        const module = await Module.findOneAndDelete({
            _id: id,
            instructorId: req.user._id
        });

        if(!module){
            return res.status(404).json({ error: "Module not found" });
        }

        res.status(200).json({ message: "Module deleted successfully", module });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getModuleController = async (req, res) => {
    try {
        const { id } = req.params;
        if(!id){
            return res.status(400).json({ error: "Invalid request" });
        }
        if (!req.user?._id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const module = await Module.findOne({
            _id: id,
            instructorId: req.user._id
        });

        if(!module){
            return res.status(404).json({ error: "Module not found" });
        }    

        res.status(200).json({ message: "Module found successfully", module });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
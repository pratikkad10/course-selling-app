import crypto from "crypto";
import Course from "../models/course.model.js";
import Enrollment from "../models/enrollment.model.js";
import { razorpayInstance } from "../config/razorpay.js";

export const createOrderController = async (req, res) => {
    try {

        const { courseId } = req.params;
        const userId = req.user._id;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                error: "Course not found"
            });
        }

        const options = {
            amount: course.price * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpayInstance.orders.create(options);

        await Enrollment.create({
            userId,
            courseId,
            orderId: order.id,
            amount: course.price,
            status: "pending"
        });

        res.status(200).json({
            success: true,
            order,
            key: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            error: "Internal server error"
        });
    }
};





export const verifyPaymentController = async (req, res) => {

    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(
                razorpay_order_id + "|" + razorpay_payment_id
            )
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {

            return res.status(400).json({
                error: "Invalid payment signature"
            });
        }

        const enrollment = await Enrollment.findOne({
            orderId: razorpay_order_id
        });

        if (!enrollment) {
            return res.status(404).json({
                error: "Enrollment not found"
            });
        }

        enrollment.paymentId = razorpay_payment_id;
        enrollment.status = "paid";

        await enrollment.save();

        res.status(200).json({
            success: true,
            message: "Payment verified successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Internal server error"
        });
    }
};
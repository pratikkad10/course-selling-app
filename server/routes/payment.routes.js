import express from "express";
import { adminAuth, auth } from "../middlewares/auth.middleware.js";
import { createOrderController, verifyPaymentController } from "../controllers/payment.controller";


router.post("/create-order/:courseId", auth, createOrderController);
router.post("/verify-payment", auth, verifyPaymentController);

export default router;
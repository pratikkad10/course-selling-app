import express from "express";
import {
    deactivateAccountController,
    deleteAccountController,
    forgotPasswordController,
    getAllUsersController,
    getmeController,
    getUserByIdController,
    logoutAllSessionsController,
    logoutController,
    reactivateAccountController,
    resendVerificationController,
    resetPasswordController,
    signinController,
    signupController,
    updatePasswordController,
    updateProfileController,
    verifyEmailController
} from "../controllers/user.controller.js";
import { adminAuth, auth } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/signup", signupController);
router.post("/signin", signinController);
router.post("/logout", logoutController);
router.get("/me", auth, getmeController);
router.post("/verify/:token", verifyEmailController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password/:token", resetPasswordController);
router.patch("/update-profile", auth, updateProfileController);
router.patch("/update-password", auth, updatePasswordController);
router.post("/resend-verification", resendVerificationController);
router.post("/logout-all", auth, logoutAllSessionsController);
router.delete("/delete-account", auth, deleteAccountController);
router.patch("/deactivate-account", auth, deactivateAccountController);
router.patch("/reactivate-account", auth, reactivateAccountController);
router.get("/:id", auth, adminAuth, getUserByIdController);
router.get("/", auth, adminAuth, getAllUsersController);
// router.post("/refresh-token", refreshTokenController);

export default router;
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { User } from "../models/user.model.js";
import {
    emailSchema,
    passwordSchema,
    signinSchema,
    signupSchema,
    updatePasswordSchema,
    updateProfileSchema
} from "../validation/user.validation.js";

export const signupController = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const validData = signupSchema.safeParse({ name, email, password, role });
        if (!validData.success) {
            return res.status(400).json({ error: result.error });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const rawVerificationToken = crypto.randomBytes(32).toString("hex");
        console.log("Raw verification token:", rawVerificationToken);
        const hashedVerificationToken = crypto
            .createHash("sha256")
            .update(rawVerificationToken)
            .digest("hex");

        const verificationLink = `${process.env.FRONTEND_URL}/verify/${rawVerificationToken}`;
        //TODO: send email with an verification link including verification link
        console.log("Verification token:", rawVerificationToken);
        console.log("Verification link:", verificationLink);
        const newUser = await User.create({
            ...validData.data,
            password: hashedPassword,
            verificationToken: hashedVerificationToken,
            verificationTokenExpires: Date.now() + 15 * 60 * 1000,
        });
        if (!newUser) {
            return res.status(500).json({ error: "Failed to create user" });
        }
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: "Email already exists" });
        }
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const signinController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validData = signinSchema.safeParse({ email, password });

        if (!validData.success) {
            return res.status(400).json({ error: result.error });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const isPasswordValid = await bcrypt.compare(validData.data.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        const cookieOptions = {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        res.cookie("token", token, cookieOptions);

        res.status(200).json({
            message: "Login successful",
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    };
}

export const logoutController = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logout successful" });
    } catch (e) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getmeController = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const verifyEmailController = async (req, res) => {
    try {
        const { token } = req.params;
        if (!token) {
            return res.status(400).json({ error: "Invalid token" });
        }
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            verificationToken: hashedToken,
            verificationTokenExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: "Email already verified" });
        }
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        user.isVerified = true;
        await user.save();
        res.status(200).json({ message: "Email verified successfully" });
    } catch (e) {
        res.status(500).json({ error: "Internal server error" });
    }
}

export const forgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body;
        const validData = emailSchema.safeParse({ email });
        if (!validData.success) {
            return res.status(400).json({ error: result.error });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const rawToken = crypto.randomBytes(32).toString("hex");
        //rawtoken is send to user 
        const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
        await user.save();
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${hashedToken}`;
        // TODO: send email here
        console.log("Reset link:", resetLink);
        res.status(200).json({ message: "Password reset link sent" });
    } catch (e) {
        res.status(500).json({ error: "Internal server error" });
    }
}

export const resetPasswordController = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const validData = passwordSchema.safeParse({ password });
        if (!validData.success) {
            return res.status(400).json({ error: result.error });
        }
       
        if (!token || !password) {
            return res.status(400).json({ error: "Invalid request" });
        }

        // Hash incoming rawtoken is hashed and compare it with the hashed token stored in the database
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // Find user with valid token + not expired
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        if (!hashedPassword) {
            return res.status(500).json({ error: "Failed to hash password" }
            );
        }
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.status(200).json({ message: "Password reset successful" });
    } catch (e) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateProfileController = async (req, res) => {
    try {
        const { name, email, contactNumber, gender, dateOfBirth, address, bio, profileImage, socialLinks } = req.body;
        const result = updateProfileSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }
        if (!req.user?._id) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (result.data.email) {
            const existingUser = await User.findOne({ email: result.data.email });
            if (existingUser && existingUser._id.toString() !== user._id.toString()) {
                return res.status(400).json({ error: "Email already in use" });
            }
        }
        const data = result.data;
        for (const key in data) {
            if (data[key] !== undefined) {
                user[key] = data[key];
            }
        }
        await user.save();
        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updatePasswordController = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const result = updatePasswordSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }
        if (!req.user?._id) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ error: "Invalid request" });
        }
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid password" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message: "Password updated successfully" });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const resendVerificationController = async (req, res) => {
    try {
        const { email } = req.body;
        const validEmail = emailSchema.safeParse({ email });
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (user.isVerified) {
            return res.status(400).json({ error: "Email already verified" });
        }
        const hashedPassword = await bcrypt.hash(validData.password, 10);
        const rawVerificationToken = crypto.randomBytes(32).toString("hex");
        const hashedVerificationToken = crypto
            .createHash("sha256")
            .update(rawVerificationToken)
            .digest("hex");

        const verificationLink = `${process.env.FRONTEND_URL}/verify/${rawVarificationToken}`;
        //TODO: send email with an verification link including verification link
        console.log("Verification token:", rawVerificationToken);
        console.log("Verification link:", verificationLink);

        user.verificationToken = hashedVerificationToken;
        user.verificationTokenExpires = Date.now() + 15 * 60 * 1000;
        await user.save();
        res.status(200).json({ message: "Verification email sent" });
    } catch (e) {
        res.status(500).json({ error: "Internal server error" });
    }

}

export const logoutAllSessionsController = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        req.user.tokens = [];
        await req.user.save();
        res.status(200).json({ message: "All sessions logged out successfully" });
    } catch (e) {
        res.status(500).json({ error: "Internal server error" });
    }
}

export const deleteAccountController = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { password } = req.body;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (!password) {
            return res.status(400).json({ error: "Password is required" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect password" });
        }

        // Soft delete instead of hard delete
        user.isDeleted = true;
        user.deletedAt = new Date();

        await user.save();

        res.status(200).json({ message: "Account deleted (soft)" });

    } catch (e) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deactivateAccountController = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const { password } = req.body;
        const validPassword = passwordSchema.safeParse({ password });
        if (!validPassword.success) {
            return res.status(400).json({ error: validPassword.error });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect password" });
        }

        user.isActive = false;
        await user.save();
    } catch (e) {
        res.status(500).json({ error: "Internal server error" });
    }
}

export const reactivateAccountController = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { password } = req.body;
        const validPassword = passwordSchema.safeParse({ password });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect password" });
        }
        user.isActive = true;
        await user.save();
        res.status(200).json({ message: "Account reactivated successfully" });
    } catch (e) {
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getUserByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Invalid request" });
        }
        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getAllUsersController = async (req, res) => {
    try {
        // Pagination
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const users = await User.find({ isDeleted: false })
            .select("-password")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalUsers = await User.countDocuments({
            isDeleted: false
        });

        res.status(200).json({
            users,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers
        });
    } catch (e) {
        res.status(500).json({ error: "Internal server error" });
    }
}
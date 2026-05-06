import zod, { email } from "zod";

export const signupSchema = zod.object({
    name: zod.string().min(3).max(50),
    email: zod.string().email(),
    role: zod.enum(['student', 'instructor', 'admin']),
    password: zod.string().min(4).max(20),
})

export const signinSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(4).max(20),
})

export const updateProfileSchema = zod.object({
    name: zod.string().min(3).max(50),
    email: zod.string().email(),
    contactNumber: zod.string(),
    gender: zod.enum(['male', 'female', 'other']),
    dateOfBirth: zod.date(),
    address: zod.string(),
    bio: zod.string(),
    profileImage: zod.string(),
    socialLinks: zod.object({
        facebook: zod.string(),
        twitter: zod.string(),
        instagram: zod.string(),
        linkedin: zod.string(),
    }),
})

export const updatePasswordSchema = zod.object({
    oldPassword: zod.string().min(4).max(20),
    newPassword: zod.string().min(4).max(20),
})

export const emailSchema = zod.object({ email: zod.string().email() });

export const passwordSchema = zod.object({ password: zod.string().min(4).max(20) });

export const tokenSchema = zod.object({ token: zod.string() });

export const userIdSchema = zod.object({ userId: zod.string() });
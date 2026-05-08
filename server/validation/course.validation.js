import zod from "zod";

export const createCourseValidation = zod.object({

    title: z
        .string()
        .trim()
        .min(3, "Title must be at least 3 characters")
        .max(120, "Title is too long"),

    slug: z
        .string()
        .trim()
        .toLowerCase()
        .min(3)
        .max(120)
        .regex(
            /^[a-z0-9-]+$/,
            "Slug can only contain lowercase letters, numbers, and hyphens"
        ),

    description: z
        .string()
        .min(20, "Description must be at least 20 characters")
        .max(5000),

    shortDescription: z
        .string()
        .max(300)
        .optional(),

    instructor: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid instructor id"),

    image: z
        .string()
        .url("Image must be a valid URL")
        .optional(),

    previewVideo: z
        .string()
        .url("Preview video must be a valid URL")
        .optional(),

    price: z
        .number()
        .min(0, "Price cannot be negative"),

    discount: z
        .number()
        .min(0)
        .max(100)
        .optional(),

    isFree: z
        .boolean()
        .optional(),

    categories: z
        .array(
            z.string().trim().min(1)
        )
        .optional(),

    tags: z
        .array(
            z.string().trim().toLowerCase()
        )
        .optional(),

    level: z
        .enum([
            "beginner",
            "intermediate",
            "advanced"
        ])
        .optional(),

    language: z
        .string()
        .trim()
        .optional(),

    duration: z
        .number()
        .min(0)
        .optional(),

    isPublished: z
        .boolean()
        .optional(),
});

export const updateCourseValidation = createCourseValidation.partial();
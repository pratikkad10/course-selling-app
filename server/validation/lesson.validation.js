import zod from "zod";
import { vi } from "zod/v4/locales";

export const lessonValidation = zod.object({
    title: zod.string().min(3).max(120),
    videoUrl: zod.string().url(),
    duration: zod.number().min(0),
    isPreview: zod.boolean(),
    isFree: zod.boolean(),
    moduleId: zod.string().regex(/^[0-9a-fA-F]{24}$/),
    order: zod.number().min(1),
})

export const updateLessonValidation = lessonValidation.partial();
import zod from "zod";

export const moduleValidation = zod.object({
    title: zod.string().min(3).max(120),
    order: zod.number().min(1),
});

export const updateModuleValidation = moduleValidation.partial();
import { z } from "zod";

//
//

export const profileSchema = z.object({
  name: z.string().trim().min(1, "Укажите имя").max(120, "Имя не должно превышать 120 символов"),
  role: z.string().trim().min(1, "Укажите роль").max(120, "Роль не должна превышать 120 символов"),
  schemaName: z
    .string()
    .trim()
    .min(1, "Укажите название схемы")
    .max(120, "Название схемы не должно превышать 120 символов"),
});

export type ProfileFF = z.infer<typeof profileSchema>;

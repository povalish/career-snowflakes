import { describe, expect, it } from "vitest";

import { profileSchema } from "./profile.schema";

//
//

const validProfile = {
  name: "Алекс",
  role: "Инженер",
  schemaName: "Моя матрица",
};

//
//

describe("ZOD: profile schema", () => {
  //
  //

  describe("positive cases", () => {
    it("accepts a valid profile", () => {
      expect(profileSchema.safeParse(validProfile).success).toBe(true);
    });

    it("trims every field", () => {
      expect(
        profileSchema.parse({
          name: "  Алекс  ",
          role: "  Инженер  ",
          schemaName: "  Моя матрица  ",
        }),
      ).toEqual(validProfile);
    });

    it("accepts values at the length boundaries", () => {
      expect(
        profileSchema.safeParse({
          name: "А",
          role: "Р".repeat(120),
          schemaName: "С".repeat(120),
        }).success,
      ).toBe(true);
    });
  });

  //
  //

  describe("negative cases", () => {
    it.each([
      ["name", "", "Укажите имя"],
      ["name", "   ", "Укажите имя"],
      ["role", "", "Укажите роль"],
      ["role", "   ", "Укажите роль"],
      ["schemaName", "", "Укажите название схемы"],
      ["schemaName", "   ", "Укажите название схемы"],
    ] as const)("rejects an empty %s", (field, value, message) => {
      const result = profileSchema.safeParse({ ...validProfile, [field]: value });

      expect(result.success).toBe(false);
      if (result.success) return;

      expect(result.error.issues).toContainEqual(
        expect.objectContaining({ path: [field], message }),
      );
    });

    it.each([
      ["name", "Имя не должно превышать 120 символов"],
      ["role", "Роль не должна превышать 120 символов"],
      ["schemaName", "Название схемы не должно превышать 120 символов"],
    ] as const)("rejects %s longer than 120 characters", (field, message) => {
      const result = profileSchema.safeParse({ ...validProfile, [field]: "А".repeat(121) });

      expect(result.success).toBe(false);
      if (result.success) return;

      expect(result.error.issues).toContainEqual(
        expect.objectContaining({ path: [field], message }),
      );
    });

    it("rejects missing fields", () => {
      expect(profileSchema.safeParse({}).success).toBe(false);
    });

    it("rejects fields with non-string values", () => {
      expect(
        profileSchema.safeParse({
          name: 42,
          role: null,
          schemaName: true,
        }).success,
      ).toBe(false);
    });
  });
});

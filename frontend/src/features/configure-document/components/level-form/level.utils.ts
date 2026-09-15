import type { LevelFF } from "../../schemas/level";

//
//

export const createLevel = (number: number): LevelFF => ({
  name: `Level ${number}`,
  description: "",
  examplesText: "",
  reached: false,
});

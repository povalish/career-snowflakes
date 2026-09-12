import type { CareerDocument } from "../model/types";

export function createCareerDocument(): CareerDocument {
  return {
    version: 1,
    profile: { name: "Алекс", role: "Инженер" },
    schema: {
      name: "Карта инженера",
      groups: [
        {
          id: "engineering",
          name: "Инженерия",
          color: "aqua",
          tracks: [
            {
              id: "web",
              name: "Веб",
              description: "Создание интерфейсов",
              levels: [
                {
                  name: "Основы",
                  description: "Небольшие задачи",
                  examples: ["Создать компонент"],
                },
                { name: "Практика", description: "Самостоятельная работа", examples: [] },
                { name: "Архитектура", description: "Проектирование систем", examples: [] },
              ],
            },
            {
              id: "servers",
              name: "Серверы",
              description: "Работа с API",
              levels: [{ name: "Основы API", description: "Создать обработчик", examples: [] }],
            },
          ],
        },
        {
          id: "people",
          name: "Люди",
          color: "purple",
          tracks: [
            {
              id: "mentoring",
              name: "Менторство",
              description: "Помощь коллегам",
              levels: [
                { name: "Поддержка", description: "Делиться знаниями", examples: [] },
                { name: "Развитие", description: "План развития коллеги", examples: [] },
              ],
            },
          ],
        },
      ],
    },
    progress: { web: 1, servers: 0, mentoring: 0 },
  };
}

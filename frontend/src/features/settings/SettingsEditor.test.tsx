import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { CareerDocument } from "../career/types";
import { SettingsEditor } from "./SettingsEditor";

function createDocument(): CareerDocument {
  return {
    version: 1,
    profile: { name: "Алекс", role: "Инженер" },
    schema: {
      name: "Моя матрица",
      groups: [
        {
          id: "engineering",
          name: "Инженерия",
          color: "aqua",
          tracks: [
            {
              id: "web",
              name: "Веб",
              description: "Разработка интерфейсов",
              levels: [
                {
                  name: "Основы",
                  description: "Небольшие задачи",
                  examples: ["Создаёт компонент"],
                },
                { name: "Практика", description: "Самостоятельная работа", examples: [] },
              ],
            },
            {
              id: "servers",
              name: "Серверы",
              description: "",
              levels: [{ name: "Основы", description: "", examples: [] }],
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
              description: "",
              levels: [{ name: "Основы", description: "", examples: [] }],
            },
          ],
        },
      ],
    },
    progress: { web: 2, servers: 1, mentoring: 1 },
  };
}

function setup(document = createDocument()) {
  const onSave = vi.fn<(document: CareerDocument) => Promise<boolean>>().mockResolvedValue(true);
  const onClose = vi.fn<() => void>();
  const user = userEvent.setup();
  render(<SettingsEditor document={document} busy={false} onSave={onSave} onClose={onClose} />);
  return { document, onSave, onClose, user };
}

describe("SettingsEditor", () => {
  it("keeps edits in a draft and confirms discarding them", async () => {
    const { document, onSave, onClose, user } = setup();
    await user.clear(screen.getByLabelText("Ваше имя"));
    await user.type(screen.getByLabelText("Ваше имя"), "Мария");
    await user.click(screen.getByRole("button", { name: "Отмена" }));

    expect(document.profile.name).toBe("Алекс");
    expect(onSave).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole("alertdialog")).toHaveTextContent(
      "Несохранённые правки будут потеряны",
    );

    await user.click(screen.getByRole("button", { name: "Продолжить редактирование" }));
    expect(screen.getByLabelText("Ваше имя")).toHaveValue("Мария");
    await user.click(screen.getByRole("button", { name: "Отмена" }));
    await user.click(screen.getByRole("button", { name: "Подтвердить" }));
    expect(onClose).toHaveBeenCalledOnce();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("saves a new group and its editable track, levels, and examples", async () => {
    const { onSave, user } = setup();
    await user.click(screen.getByRole("button", { name: "Добавить направление" }));
    await user.clear(screen.getByLabelText("Название направления"));
    await user.type(screen.getByLabelText("Название направления"), "Влияние");
    await user.selectOptions(screen.getByLabelText("Цвет направления"), "orange");
    await user.clear(screen.getByLabelText("Название трека"));
    await user.type(screen.getByLabelText("Название трека"), "Публичные выступления");
    await user.click(screen.getByRole("button", { name: "Добавить уровень" }));
    await user.clear(screen.getByLabelText("Название уровня"));
    await user.type(screen.getByLabelText("Название уровня"), "Эксперт");
    await user.type(
      screen.getByLabelText("Примеры поведения и задач"),
      "Доклад на конференции\nОбучение коллег",
    );
    await user.click(screen.getByRole("button", { name: "Сохранить изменения" }));

    const saved = onSave.mock.calls[0]?.[0];
    const group = saved?.schema.groups[2];
    const track = group?.tracks[0];
    expect(group).toMatchObject({ name: "Влияние", color: "orange" });
    expect(track?.name).toBe("Публичные выступления");
    expect(track?.levels).toHaveLength(6);
    expect(track?.levels[5]).toMatchObject({
      name: "Эксперт",
      examples: ["Доклад на конференции", "Обучение коллег"],
    });
    expect(saved?.progress[track?.id ?? ""]).toBe(0);
  });

  it("prunes progress when confirmed tracks and groups are removed", async () => {
    const { document, onSave, user } = setup();
    await user.click(screen.getByRole("button", { name: "Удалить трек" }));
    await user.click(screen.getByRole("button", { name: "Подтвердить" }));
    expect(screen.getByLabelText("Название трека")).toHaveValue("Серверы");
    expect(screen.getByRole("button", { name: "Удалить трек" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Люди" }));
    await user.click(screen.getByRole("button", { name: "Удалить направление" }));
    await user.click(screen.getByRole("button", { name: "Подтвердить" }));
    await user.click(screen.getByRole("button", { name: "Сохранить изменения" }));

    expect(onSave.mock.calls[0]?.[0].progress).toEqual({ servers: 1 });
    expect(document.progress).toEqual({ web: 2, servers: 1, mentoring: 1 });
    expect(screen.getByRole("button", { name: "Удалить направление" })).toBeDisabled();
  });

  it("clamps progress after reducing the number of levels and keeps at least one", async () => {
    const { onSave, user } = setup();
    await user.click(screen.getByRole("button", { name: "Уровень 2" }));
    await user.click(screen.getByRole("button", { name: "Удалить уровень" }));
    await user.click(screen.getByRole("button", { name: "Подтвердить" }));
    expect(screen.getByLabelText("Название уровня")).toHaveValue("Основы");
    expect(screen.getByRole("button", { name: "Удалить уровень" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Сохранить изменения" }));

    expect(onSave.mock.calls[0]?.[0].progress.web).toBe(1);
    expect(onSave.mock.calls[0]?.[0].schema.groups[0]?.tracks[0]?.levels).toHaveLength(1);
  });

  it("creates and selects a new track without changing existing progress", async () => {
    const { onSave, user } = setup();
    await user.click(screen.getByRole("button", { name: "Добавить трек" }));
    expect(screen.getByLabelText("Название трека")).toHaveValue("Новый трек");
    await user.click(screen.getByRole("button", { name: "Сохранить изменения" }));

    const saved = onSave.mock.calls[0]?.[0];
    expect(saved?.schema.groups[0]?.tracks).toHaveLength(3);
    expect(saved?.progress.web).toBe(2);
    expect(saved?.progress.servers).toBe(1);
    expect(Object.values(saved?.progress ?? {}).filter((value) => value === 0)).toHaveLength(1);
  });

  it("does not mark a future stage as reached after deleting an earlier completed stage", async () => {
    const initial = createDocument();
    initial.progress.web = 1;
    const { onSave, user } = setup(initial);
    await user.click(screen.getByRole("button", { name: "Удалить уровень" }));
    await user.click(screen.getByRole("button", { name: "Подтвердить" }));
    expect(screen.getByLabelText("Название уровня")).toHaveValue("Практика");
    await user.click(screen.getByRole("button", { name: "Сохранить изменения" }));

    expect(onSave.mock.calls[0]?.[0].progress.web).toBe(0);
    expect(initial.progress.web).toBe(1);
  });

  it("preserves reached stages when an upcoming stage is deleted", async () => {
    const initial = createDocument();
    initial.progress.web = 1;
    const { onSave, user } = setup(initial);
    await user.click(screen.getByRole("button", { name: "Уровень 2" }));
    await user.click(screen.getByRole("button", { name: "Удалить уровень" }));
    await user.click(screen.getByRole("button", { name: "Подтвердить" }));
    await user.click(screen.getByRole("button", { name: "Сохранить изменения" }));

    expect(onSave.mock.calls[0]?.[0].progress.web).toBe(1);
    expect(onSave.mock.calls[0]?.[0].schema.groups[0]?.tracks[0]?.levels[0]?.name).toBe("Основы");
  });
});

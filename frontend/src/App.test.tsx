import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import App from "./App";
import type { CareerClient } from "./features/career/client";
import type { CareerDocument } from "./features/career/types";
import { createCareerDocument } from "./test/career-fixture";

function createClient(document = createCareerDocument()) {
  return {
    load: vi.fn<CareerClient["load"]>().mockResolvedValue(document),
    save: vi.fn<CareerClient["save"]>().mockImplementation(async (next) => next),
    importDocument: vi.fn<CareerClient["importDocument"]>().mockResolvedValue(null),
    exportDocument: vi.fn<CareerClient["exportDocument"]>().mockResolvedValue(true),
  };
}

async function openApp(client = createClient()) {
  const user = userEvent.setup();
  render(<App client={client} />);
  await screen.findByRole("heading", { name: "Карта инженера" });
  return { client, user };
}

describe("App layout and actions", () => {
  it("renders the chart and icon actions without persistent details", async () => {
    await openApp();
    const actions = screen.getByRole("group", { name: "Действия с картой" });

    expect(within(actions).getAllByRole("button")).toHaveLength(4);
    for (const name of ["Импорт", "Экспорт", "Включить светлую тему", "Настройки"]) {
      expect(within(actions).getByRole("button", { name })).not.toHaveTextContent(/\S/);
    }
    expect(screen.queryByText("career")).not.toBeInTheDocument();
    expect(screen.queryByText("Расти в своём направлении.")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Общий прогресс")).not.toBeInTheDocument();
    expect(screen.queryByText("Достигнуто")).not.toBeInTheDocument();
    expect(screen.queryByText("Выбранный этап")).not.toBeInTheDocument();
    expect(screen.queryByText("У каждого свой рисунок роста.")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Вдохновлено Medium Engineering Growth Framework"),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("keeps export, theme, and settings available from the action dock", async () => {
    document.documentElement.className = "dark";
    const { client, user } = await openApp();
    const actions = screen.getByRole("group", { name: "Действия с картой" });

    await user.click(within(actions).getByRole("button", { name: "Экспорт" }));
    await waitFor(() => expect(client.exportDocument).toHaveBeenCalledOnce());

    await user.click(within(actions).getByRole("button", { name: "Включить светлую тему" }));
    expect(document.documentElement).toHaveClass("light");
    expect(document.documentElement).not.toHaveClass("dark");
    await user.click(within(actions).getByRole("button", { name: "Включить тёмную тему" }));
    expect(document.documentElement).toHaveClass("dark");

    await user.click(within(actions).getByRole("button", { name: "Настройки" }));
    expect(screen.getByRole("heading", { name: "Настройки матрицы" })).toBeInTheDocument();
    expect(screen.queryByRole("group", { name: "Действия с картой" })).not.toBeInTheDocument();
  });
});

describe("App persistence", () => {
  it("changes the selected chart stage without saving progress", async () => {
    const { client, user } = await openApp();
    const stage = screen.getByRole("button", { name: "Менторство, уровень 2: Развитие" });

    await user.click(stage);

    expect(stage).toHaveAttribute("aria-pressed", "true");
    expect(
      within(screen.getByRole("navigation", { name: "Треки развития" })).getByRole("button", {
        name: /Менторство/,
      }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Веб, уровень 1: Основы, достигнут" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Веб, уровень 2: Практика" })).toBeInTheDocument();
    expect(client.save).not.toHaveBeenCalled();
  });

  it("opens details when the selected sector is activated again", async () => {
    const { user } = await openApp();
    const stage = screen.getByRole("button", { name: "Менторство, уровень 2: Развитие" });

    await user.click(stage);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(stage);

    const dialog = await screen.findByRole("dialog", { name: "Менторство: уровень 2" });
    expect(within(dialog).getByRole("heading", { name: "Менторство" })).toBeInTheDocument();
    expect(within(dialog).getByRole("heading", { name: "Развитие" })).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Закрыть" })).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await waitFor(() => expect(stage).toHaveFocus());
  });

  it("keeps track rows and other sectors as selection-only controls", async () => {
    const { user } = await openApp();
    const selectedTrack = within(
      screen.getByRole("navigation", { name: "Треки развития" }),
    ).getByRole("button", { name: /Веб/ });
    const stage = screen.getByRole("button", { name: "Веб, уровень 3: Архитектура" });

    await user.click(selectedTrack);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(stage);

    expect(stage).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("commits the server response only after a successful save", async () => {
    const original = createCareerDocument();
    const client = createClient(original);
    let finishSave: ((document: CareerDocument) => void) | undefined;
    const saveRequest = new Promise<CareerDocument>((resolve) => {
      finishSave = resolve;
    });
    client.save.mockReturnValue(saveRequest);
    const { user } = await openApp(client);
    await user.click(screen.getByRole("button", { name: "Веб, уровень 2: Практика" }));
    const dialog = await screen.findByRole("dialog", { name: "Веб: уровень 2" });

    await user.click(within(dialog).getByRole("button", { name: "Установить уровень 2" }));

    expect(client.save).toHaveBeenCalledExactlyOnceWith({
      ...original,
      progress: { ...original.progress, web: 2 },
    });
    expect(original.progress.web).toBe(1);
    expect(within(dialog).getByRole("button", { name: "Установить уровень 2" })).toBeDisabled();

    const saved = createCareerDocument();
    saved.progress.web = 3;
    await act(async () => {
      if (!finishSave) throw new Error("Save request was not created");
      finishSave(saved);
      await saveRequest;
    });

    expect(screen.queryByText("Изменения сохранены")).not.toBeInTheDocument();
    await user.click(within(dialog).getByRole("button", { name: "Закрыть" }));
    expect(
      screen.getByRole("button", { name: "Веб, уровень 3: Архитектура, достигнут" }),
    ).toBeInTheDocument();
  });

  it("retains previous progress and allows retry after a save failure", async () => {
    const client = createClient();
    client.save.mockRejectedValueOnce(new Error("Нет доступа к файлу"));
    const { user } = await openApp(client);
    await user.click(screen.getByRole("button", { name: "Веб, уровень 2: Практика" }));
    const dialog = await screen.findByRole("dialog", { name: "Веб: уровень 2" });

    await user.click(within(dialog).getByRole("button", { name: "Установить уровень 2" }));

    expect(await within(dialog).findByRole("alert")).toHaveTextContent("Нет доступа к файлу");
    expect(within(dialog).getByRole("button", { name: "Установить уровень 2" })).toBeEnabled();

    await user.click(within(dialog).getByRole("button", { name: "Установить уровень 2" }));

    await waitFor(() =>
      expect(within(dialog).getByRole("button", { name: "Текущий уровень" })).toBeInTheDocument(),
    );
    expect(within(dialog).queryByRole("alert")).not.toBeInTheDocument();
    expect(client.save).toHaveBeenCalledTimes(2);
  });

  it("does not open the file dialog when the import confirmation is cancelled", async () => {
    const { client, user } = await openApp();
    await user.click(screen.getByRole("button", { name: "Импорт" }));
    const dialog = await screen.findByRole("alertdialog");

    await user.click(within(dialog).getByRole("button", { name: "Отмена" }));

    expect(client.importDocument).not.toHaveBeenCalled();
    expect(screen.getByRole("heading", { name: "Карта инженера" })).toBeInTheDocument();
  });

  it("keeps the document and selection when the native import dialog is cancelled", async () => {
    const { client, user } = await openApp();
    await user.click(screen.getByRole("button", { name: "Менторство, уровень 2: Развитие" }));
    await user.click(screen.getByRole("button", { name: "Импорт" }));
    await user.click(await screen.findByRole("button", { name: "Выбрать JSON-файл" }));

    await waitFor(() => expect(client.importDocument).toHaveBeenCalledOnce());
    expect(screen.getByRole("heading", { name: "Карта инженера" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Менторство, уровень 2: Развитие" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(
      screen.getByRole("button", { name: "Веб, уровень 1: Основы, достигнут" }),
    ).toBeInTheDocument();
    expect(client.save).not.toHaveBeenCalled();
  });

  it("selects a valid imported track when the previous track no longer exists", async () => {
    const imported = createCareerDocument();
    imported.schema.name = "Карта наставника";
    imported.schema.groups = imported.schema.groups.filter((group) => group.id === "people");
    imported.progress = { mentoring: 1 };
    const client = createClient();
    client.importDocument.mockResolvedValue(imported);
    const { user } = await openApp(client);

    await user.click(screen.getByRole("button", { name: "Импорт" }));
    await user.click(await screen.findByRole("button", { name: "Выбрать JSON-файл" }));

    expect(await screen.findByRole("heading", { name: "Карта наставника" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Менторство, уровень 2: Развитие" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.queryByRole("button", { name: /Веб, уровень/ })).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Менторство, уровень 1: Поддержка, достигнут" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(client.save).not.toHaveBeenCalled();
  });
});

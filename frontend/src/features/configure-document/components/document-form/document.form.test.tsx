import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { GROUP_COLORS } from "@/shared/config/track-colors";

import type { DocumentFF } from "../../schemas/document";
import { DocumentForm } from "./document.form";

//
//

const defaultValues: DocumentFF = {
  name: "Career Matrix",
  groups: [
    {
      id: "technology",
      name: "Technology",
      color: "aqua",
      tracks: [
        {
          id: "frontend",
          code: "FE",
          name: "Frontend",
          description: "Building user interfaces.",
          resources: "",
          levels: [
            {
              name: "Introduction",
              description: "Learn the basics.",
              examplesText: "Build a component",
              reached: false,
            },
          ],
        },
      ],
    },
  ],
};

const createGroup = (index: number): DocumentFF["groups"][number] => ({
  id: `group-${index}`,
  name: `Group ${index}`,
  color: GROUP_COLORS[index % GROUP_COLORS.length] ?? "aqua",
  tracks: [
    {
      ...defaultValues.groups[0]!.tracks[0]!,
      id: `track-${index}`,
      code: `A${String.fromCharCode(65 + index)}`,
    },
  ],
});

//
//

afterEach(cleanup);

//
//

describe("<DocumentForm />", () => {
  it("edits and submits the document configuration", async () => {
    const onSubmit = vi.fn<(values: DocumentFF) => Promise<void>>().mockResolvedValue(undefined);

    render(<DocumentForm defaultValues={defaultValues} onSubmit={onSubmit} />);

    expect(screen.getByRole("form", { name: "Document settings" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Configure document" })).toBeVisible();

    const nameInput = screen.getByRole("textbox", { name: "Schema name" });
    const submitButton = screen.getByRole("button", { name: "Apply changes" });

    expect(nameInput).toHaveValue("Career Matrix");
    expect(submitButton).toBeDisabled();
    expect(screen.getByRole("button", { name: "Technology" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Remove group" })).toBeDisabled();

    fireEvent.change(nameInput, { target: { value: "Updated Career Matrix" } });

    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        ...defaultValues,
        name: "Updated Career Matrix",
      }),
    );
    await waitFor(() => expect(submitButton).toBeDisabled());
  });

  it("retains group edits when switching groups", async () => {
    const onSubmit = vi.fn<(values: DocumentFF) => Promise<void>>().mockResolvedValue(undefined);
    const values = { ...defaultValues, groups: [createGroup(0), createGroup(1)] };

    render(<DocumentForm defaultValues={values} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole("button", { name: "Group 1" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Group name" }), {
      target: { value: "Product engineering" },
    });
    fireEvent.change(screen.getByRole("combobox", { name: "Group color" }), {
      target: { value: "purple" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Group 0" }));
    expect(screen.getByRole("textbox", { name: "Group name" })).toHaveValue("Group 0");

    fireEvent.click(screen.getByRole("button", { name: "Product engineering" }));
    expect(screen.getByRole("textbox", { name: "Group name" })).toHaveValue("Product engineering");
    expect(screen.getByRole("combobox", { name: "Group color" })).toHaveValue("purple");

    fireEvent.click(screen.getByRole("button", { name: "Apply changes" }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        ...values,
        groups: [
          values.groups[0],
          { ...values.groups[1], name: "Product engineering", color: "purple" },
        ],
      }),
    );
  });

  it("adds and selects a group with an initial track", async () => {
    const onSubmit = vi.fn<(values: DocumentFF) => Promise<void>>().mockResolvedValue(undefined);

    render(<DocumentForm defaultValues={defaultValues} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole("button", { name: "Add group" }));

    expect(screen.getByRole("button", { name: "New group" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("textbox", { name: "Group name" })).toHaveValue("New group");
    expect(screen.getByRole("combobox", { name: "Group color" })).toHaveValue("blue");

    fireEvent.click(screen.getByRole("button", { name: "Apply changes" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
    const submittedGroup = onSubmit.mock.calls[0]?.[0].groups[1];

    expect(submittedGroup).toMatchObject({ name: "New group", color: "blue" });
    expect(submittedGroup?.tracks[0]).toMatchObject({ code: "AA", name: "New track" });
    expect(submittedGroup?.tracks[0]?.levels).toHaveLength(5);
    expect(submittedGroup?.tracks[0]?.levels[0]).toMatchObject({
      name: "Level 1",
      reached: false,
    });
  });

  it("confirms group removal and selects the previous group", () => {
    const confirm = vi
      .spyOn(window, "confirm")
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);
    const values = { ...defaultValues, groups: [createGroup(0), createGroup(1)] };

    render(
      <DocumentForm
        defaultValues={values}
        onSubmit={vi.fn<(values: DocumentFF) => Promise<void>>()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Group 1" }));
    fireEvent.click(screen.getByRole("button", { name: "Remove group" }));

    expect(screen.getByRole("button", { name: "Group 1" })).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Remove group" }));

    expect(screen.queryByRole("button", { name: "Group 1" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Group 0" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Remove group" })).toBeDisabled();
    expect(confirm).toHaveBeenCalledTimes(2);

    confirm.mockRestore();
  });

  it("does not allow more than eight groups", () => {
    const values = {
      ...defaultValues,
      groups: Array.from({ length: 8 }, (_, index) => createGroup(index)),
    };

    render(
      <DocumentForm
        defaultValues={values}
        onSubmit={vi.fn<(values: DocumentFF) => Promise<void>>()}
      />,
    );

    expect(screen.getByRole("button", { name: "Add group" })).toBeDisabled();
  });
});

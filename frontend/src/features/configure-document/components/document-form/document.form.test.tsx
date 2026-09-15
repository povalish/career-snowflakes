import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

const createLevel = (
  index: number,
  reached = false,
): DocumentFF["groups"][number]["tracks"][number]["levels"][number] => ({
  name: `Stage ${index + 1}`,
  description: `Stage ${index + 1} description.`,
  examplesText: `Stage ${index + 1} example`,
  reached,
});

const createTrack = (index: number): DocumentFF["groups"][number]["tracks"][number] => ({
  ...defaultValues.groups[0]!.tracks[0]!,
  id: `track-${index}`,
  code: `${String.fromCharCode(65 + Math.floor(index / 26))}${String.fromCharCode(65 + (index % 26))}`,
  name: `Track ${index}`,
});

const createGroup = (index: number): DocumentFF["groups"][number] => ({
  id: `group-${index}`,
  name: `Group ${index}`,
  color: GROUP_COLORS[index % GROUP_COLORS.length] ?? "aqua",
  tracks: [createTrack(index)],
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
    expect(screen.getByRole("heading", { name: "General" })).toBeVisible();

    const nameInput = screen.getByRole("textbox", { name: "Matrix name" });
    const submitButton = screen.getByRole("button", { name: "Apply changes" });

    expect(nameInput).toHaveValue("Career Matrix");
    expect(submitButton).toBeDisabled();
    expect(screen.getByRole("button", { name: "General" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.change(nameInput, { target: { value: "Updated Career Matrix" } });
    fireEvent.click(screen.getByRole("button", { name: "FE Frontend" }));
    expect(screen.getByRole("button", { name: "Technology" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Remove group" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "FE Frontend" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Remove track" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Level 1: Introduction" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Remove level" })).toBeDisabled();

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
    fireEvent.click(screen.getByRole("radio", { name: "Purple" }));

    fireEvent.click(screen.getByRole("button", { name: "Group 0" }));
    expect(screen.getByRole("textbox", { name: "Group name" })).toHaveValue("Group 0");

    fireEvent.click(screen.getByRole("button", { name: "Product engineering" }));
    expect(screen.getByRole("textbox", { name: "Group name" })).toHaveValue("Product engineering");
    expect(screen.getByRole("radio", { name: "Purple" })).toBeChecked();

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
    expect(screen.getByRole("textbox", { name: "Group name" })).toHaveFocus();
    expect(screen.getByRole("radio", { name: "Blue" })).toBeChecked();

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

  it("removes a group and selects the previous group", () => {
    const values = { ...defaultValues, groups: [createGroup(0), createGroup(1)] };

    render(
      <DocumentForm
        defaultValues={values}
        onSubmit={vi.fn<(values: DocumentFF) => Promise<void>>()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Group 1" }));
    fireEvent.click(screen.getByRole("button", { name: "Remove group" }));

    expect(screen.queryByRole("button", { name: "Group 1" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Group 0" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Remove group" })).toBeDisabled();
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

  it("retains track edits when switching tracks", async () => {
    const onSubmit = vi.fn<(values: DocumentFF) => Promise<void>>().mockResolvedValue(undefined);
    const values: DocumentFF = {
      ...defaultValues,
      groups: [{ ...defaultValues.groups[0]!, tracks: [createTrack(0), createTrack(1)] }],
    };

    render(<DocumentForm defaultValues={values} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole("button", { name: "AB Track 1" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Track code" }), {
      target: { value: "BE" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Track name" }), {
      target: { value: "Backend" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Track description" }), {
      target: { value: "Building backend services." },
    });
    fireEvent.click(screen.getByText("Learning resources"));
    fireEvent.change(screen.getByRole("textbox", { name: "Track resources" }), {
      target: { value: "[Go](https://go.dev)" },
    });

    fireEvent.click(screen.getByRole("button", { name: "AA Track 0" }));
    expect(screen.getByRole("textbox", { name: "Track name" })).toHaveValue("Track 0");

    fireEvent.click(screen.getByRole("button", { name: "BE Backend" }));
    expect(screen.getByRole("textbox", { name: "Track description" })).toHaveValue(
      "Building backend services.",
    );
    expect(screen.getByRole("textbox", { name: "Track resources" })).toHaveValue(
      "[Go](https://go.dev)",
    );

    fireEvent.click(screen.getByRole("button", { name: "Apply changes" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
    expect(onSubmit.mock.calls[0]?.[0].groups[0]?.tracks[1]).toEqual({
      ...createTrack(1),
      code: "BE",
      name: "Backend",
      description: "Building backend services.",
      resources: "[Go](https://go.dev)",
    });
  });

  it("adds and selects a track with five initial levels", async () => {
    const onSubmit = vi.fn<(values: DocumentFF) => Promise<void>>().mockResolvedValue(undefined);

    render(<DocumentForm defaultValues={defaultValues} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole("button", { name: "FE Frontend" }));

    fireEvent.click(screen.getByRole("button", { name: "Add track" }));

    expect(screen.getByRole("button", { name: "AA New track" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("textbox", { name: "Track code" })).toHaveValue("AA");
    expect(screen.getByRole("textbox", { name: "Track name" })).toHaveValue("New track");
    expect(screen.getByRole("textbox", { name: "Track name" })).toHaveFocus();

    fireEvent.click(screen.getByRole("button", { name: "Apply changes" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
    expect(onSubmit.mock.calls[0]?.[0].groups[0]?.tracks[1]?.levels).toHaveLength(5);
  });

  it("removes a track and selects the previous track", () => {
    const values: DocumentFF = {
      ...defaultValues,
      groups: [{ ...defaultValues.groups[0]!, tracks: [createTrack(0), createTrack(1)] }],
    };

    render(
      <DocumentForm
        defaultValues={values}
        onSubmit={vi.fn<(values: DocumentFF) => Promise<void>>()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "AB Track 1" }));
    fireEvent.click(screen.getByRole("button", { name: "Remove track" }));

    expect(screen.queryByRole("button", { name: "AB Track 1" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "AA Track 0" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Remove track" })).toBeDisabled();
  });

  it("does not allow more than 32 tracks in total", () => {
    const values: DocumentFF = {
      ...defaultValues,
      groups: [
        {
          ...defaultValues.groups[0]!,
          tracks: Array.from({ length: 32 }, (_, index) => createTrack(index)),
        },
      ],
    };

    render(
      <DocumentForm
        defaultValues={values}
        onSubmit={vi.fn<(values: DocumentFF) => Promise<void>>()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "AA Track 0" }));

    expect(screen.getByRole("button", { name: "Add track" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Add group" })).toBeDisabled();
  });

  it("retains level edits when switching levels", async () => {
    const onSubmit = vi.fn<(values: DocumentFF) => Promise<void>>().mockResolvedValue(undefined);
    const values: DocumentFF = {
      ...defaultValues,
      groups: [
        {
          ...defaultValues.groups[0]!,
          tracks: [
            {
              ...defaultValues.groups[0]!.tracks[0]!,
              levels: [createLevel(0), createLevel(1)],
            },
          ],
        },
      ],
    };

    render(<DocumentForm defaultValues={values} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole("button", { name: "FE Frontend" }));

    fireEvent.click(screen.getByRole("button", { name: "Level 2: Stage 2" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Level name" }), {
      target: { value: "Advanced" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Level description" }), {
      target: { value: "Lead complex projects." },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Level examples (one per line)" }), {
      target: { value: "Design a system\nMentor teammates" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Level 1: Stage 1" }));
    expect(screen.getByRole("textbox", { name: "Level name" })).toHaveValue("Stage 1");

    fireEvent.click(screen.getByRole("button", { name: "Level 2: Advanced" }));
    expect(screen.getByRole("textbox", { name: "Level description" })).toHaveValue(
      "Lead complex projects.",
    );
    expect(screen.getByRole("textbox", { name: "Level examples (one per line)" })).toHaveValue(
      "Design a system\nMentor teammates",
    );

    fireEvent.click(screen.getByRole("button", { name: "Apply changes" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
    expect(onSubmit.mock.calls[0]?.[0].groups[0]?.tracks[0]?.levels[1]).toEqual({
      ...createLevel(1),
      name: "Advanced",
      description: "Lead complex projects.",
      examplesText: "Design a system\nMentor teammates",
    });
  });

  it("adds and selects an unreached level", async () => {
    const onSubmit = vi.fn<(values: DocumentFF) => Promise<void>>().mockResolvedValue(undefined);

    render(<DocumentForm defaultValues={defaultValues} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole("button", { name: "FE Frontend" }));

    fireEvent.click(screen.getByRole("button", { name: "Add level" }));

    expect(screen.getByRole("button", { name: "Level 2: Level 2" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("textbox", { name: "Level name" })).toHaveValue("Level 2");
    expect(screen.getByRole("textbox", { name: "Level name" })).toHaveFocus();

    fireEvent.click(screen.getByRole("button", { name: "Apply changes" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
    expect(onSubmit.mock.calls[0]?.[0].groups[0]?.tracks[0]?.levels[1]).toEqual({
      name: "Level 2",
      description: "",
      examplesText: "",
      reached: false,
    });
  });

  it("removes a level while preserving reached flags", async () => {
    const onSubmit = vi.fn<(values: DocumentFF) => Promise<void>>().mockResolvedValue(undefined);
    const values: DocumentFF = {
      ...defaultValues,
      groups: [
        {
          ...defaultValues.groups[0]!,
          tracks: [
            {
              ...defaultValues.groups[0]!.tracks[0]!,
              levels: [createLevel(0, true), createLevel(1, true), createLevel(2)],
            },
          ],
        },
      ],
    };

    render(<DocumentForm defaultValues={values} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole("button", { name: "FE Frontend" }));

    fireEvent.click(screen.getByRole("button", { name: "Level 2: Stage 2" }));
    fireEvent.click(screen.getByRole("button", { name: "Remove level" }));

    expect(screen.queryByRole("button", { name: "Level 2: Stage 2" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Level 1: Stage 1" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    fireEvent.click(screen.getByRole("button", { name: "Apply changes" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
    expect(onSubmit.mock.calls[0]?.[0].groups[0]?.tracks[0]?.levels).toEqual([
      createLevel(0, true),
      createLevel(2),
    ]);
  });

  it("does not allow more than eight levels", () => {
    const values: DocumentFF = {
      ...defaultValues,
      groups: [
        {
          ...defaultValues.groups[0]!,
          tracks: [
            {
              ...defaultValues.groups[0]!.tracks[0]!,
              levels: Array.from({ length: 8 }, (_, index) => createLevel(index)),
            },
          ],
        },
      ],
    };

    render(
      <DocumentForm
        defaultValues={values}
        onSubmit={vi.fn<(values: DocumentFF) => Promise<void>>()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "FE Frontend" }));

    expect(screen.getByRole("button", { name: "Add level" })).toBeDisabled();
  });

  it("opens tracks directly across groups and retains their drafts", () => {
    const values = { ...defaultValues, groups: [createGroup(0), createGroup(1)] };
    render(
      <DocumentForm
        defaultValues={values}
        onSubmit={vi.fn<(values: DocumentFF) => Promise<void>>()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "AB Track 1" }));
    expect(screen.getByRole("textbox", { name: "Group name" })).toHaveValue("Group 1");
    fireEvent.change(screen.getByRole("textbox", { name: "Track name" }), {
      target: { value: "Updated track" },
    });
    fireEvent.click(screen.getByRole("button", { name: "AA Track 0" }));
    expect(screen.getByRole("textbox", { name: "Track name" })).toHaveValue("Track 0");
    fireEvent.click(screen.getByRole("button", { name: "AB Updated track" }));
    expect(screen.getByRole("textbox", { name: "Track name" })).toHaveValue("Updated track");
  });

  it("changes the group color with the keyboard", async () => {
    const user = userEvent.setup();
    render(
      <DocumentForm
        defaultValues={defaultValues}
        onSubmit={vi.fn<(values: DocumentFF) => Promise<void>>()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "FE Frontend" }));

    screen.getByRole("radio", { name: "Aqua" }).focus();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("radio", { name: "Blue" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Blue" })).toHaveFocus();
    expect(screen.getByRole("status")).toHaveTextContent("Unsaved changes");
  });

  it("resets edits and added groups to the last saved document", async () => {
    const onSubmit = vi.fn<(values: DocumentFF) => Promise<void>>().mockResolvedValue(undefined);
    render(<DocumentForm defaultValues={defaultValues} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByRole("textbox", { name: "Matrix name" }), {
      target: { value: "Saved matrix" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Apply changes" }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Changes saved"));

    fireEvent.change(screen.getByRole("textbox", { name: "Matrix name" }), {
      target: { value: "Discard this name" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add group" }));
    fireEvent.click(screen.getByRole("button", { name: "Reset changes" }));

    expect(screen.queryByRole("button", { name: "New group" })).not.toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Track name" })).toHaveValue("Frontend");
    expect(screen.getByRole("radio", { name: "Aqua" })).toBeChecked();
    fireEvent.click(screen.getByRole("button", { name: "General" }));
    expect(screen.getByRole("textbox", { name: "Matrix name" })).toHaveValue("Saved matrix");
    expect(screen.getByRole("button", { name: "Apply changes" })).toBeDisabled();
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("retains a failed save for retry and reports the result", async () => {
    const onSubmit = vi
      .fn<(values: DocumentFF) => Promise<void>>()
      .mockRejectedValueOnce(new Error("Disk unavailable"))
      .mockResolvedValueOnce(undefined);
    render(<DocumentForm defaultValues={defaultValues} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole("button", { name: "FE Frontend" }));

    fireEvent.change(screen.getByRole("textbox", { name: "Track name" }), {
      target: { value: "New frontend" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Apply changes" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Disk unavailable");
    expect(screen.getByRole("status")).toHaveTextContent("Unsaved changes");
    expect(screen.getByRole("textbox", { name: "Track name" })).toHaveValue("New frontend");
    fireEvent.click(screen.getByRole("button", { name: "Apply changes" }));

    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Changes saved"));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(onSubmit).toHaveBeenCalledTimes(2);
  });

  it("preserves general and track edits when switching sections", async () => {
    const onSubmit = vi.fn<(values: DocumentFF) => Promise<void>>().mockResolvedValue(undefined);
    render(<DocumentForm defaultValues={defaultValues} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByRole("textbox", { name: "Matrix name" }), {
      target: { value: "My career" },
    });
    fireEvent.click(screen.getByRole("button", { name: "FE Frontend" }));
    expect(screen.queryByRole("textbox", { name: "Matrix name" })).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox", { name: "Track name" }), {
      target: { value: "Interface engineering" },
    });
    fireEvent.click(screen.getByRole("button", { name: "General" }));
    expect(screen.getByRole("textbox", { name: "Matrix name" })).toHaveValue("My career");
    expect(screen.queryByRole("textbox", { name: "Track name" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Apply changes" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
    expect(onSubmit.mock.calls[0]?.[0].name).toBe("My career");
    expect(onSubmit.mock.calls[0]?.[0].groups[0]?.tracks[0]?.name).toBe("Interface engineering");
    fireEvent.click(screen.getByRole("button", { name: "FE Interface engineering" }));
    expect(screen.getByRole("textbox", { name: "Track name" })).toHaveValue(
      "Interface engineering",
    );
  });

  it("marks General when the matrix name is invalid while a track is open", async () => {
    const onSubmit = vi.fn<(values: DocumentFF) => Promise<void>>();
    render(<DocumentForm defaultValues={defaultValues} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByRole("textbox", { name: "Matrix name" }), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByRole("button", { name: "FE Frontend" }));
    fireEvent.click(screen.getByRole("button", { name: "Apply changes" }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "General" })).toHaveAttribute(
        "data-invalid",
        "true",
      ),
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Some fields need attention");
    expect(onSubmit).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "General" }));
    expect(screen.getByRole("textbox", { name: "Matrix name" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByText("Enter a schema name")).toBeVisible();
  });
});

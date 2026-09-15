import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

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
});

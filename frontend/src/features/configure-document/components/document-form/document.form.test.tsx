import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { DocumentFF } from "../../schemas/document";
import { DocumentForm } from "./document.form";

//
//

const defaultValues: DocumentFF = {
  name: "Career Matrix",
  groups: [],
};

//
//

describe("<DocumentForm />", () => {
  it("renders the document configuration stub", () => {
    render(<DocumentForm defaultValues={defaultValues} />);

    expect(screen.getByRole("form", { name: "Document settings" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Configure document" })).toBeVisible();
    expect(screen.getByText("Career Matrix")).toBeVisible();
    expect(screen.getByRole("button", { name: "Apply changes" })).toBeDisabled();
  });
});

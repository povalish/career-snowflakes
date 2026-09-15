import { Button } from "@/shared/ui/button";

import type { DocumentFF } from "../../schemas/document";
import { form, header } from "./document.classes";

//
//

interface IDocumentForm {
  defaultValues: DocumentFF;
}

export const DocumentForm: React.FC<IDocumentForm> = ({ defaultValues }) => {
  return (
    <form className={form()} aria-label="Document settings">
      <header className={header()}>
        <div>
          <h1 className="text-2xl font-semibold">Configure document</h1>
          <p className="text-sm text-muted-foreground">{defaultValues.name}</p>
        </div>
        <Button type="submit" disabled>
          Apply changes
        </Button>
      </header>
    </form>
  );
};

import { Dialog } from "@base-ui/react/dialog";

import { description as descriptionClass } from "./drawer.classes";

//
//

interface IDrawerDescription {
  description: string;
}

export const DrawerDescription: React.FC<IDrawerDescription> = ({ description }) => {
  return <Dialog.Description className={descriptionClass()}>{description}</Dialog.Description>;
};

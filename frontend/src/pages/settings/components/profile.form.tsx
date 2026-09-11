import { useId } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/shared/ui/input";

import type { ProfileFF } from "../schemas/profile.schema";
import { profileSchema } from "../schemas/profile.schema";

//
//

interface IProfileForm {
  defaultValues?: Partial<ProfileFF>;
  onSubmit: (data: ProfileFF) => void;
}

export const ProfileForm: React.FC<IProfileForm> = ({ defaultValues, onSubmit }) => {
  const fieldId = useId();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFF>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    values: {
      name: defaultValues?.name ?? "",
      role: defaultValues?.role ?? "",
      schemaName: defaultValues?.schemaName ?? "",
    },
  });

  const save = (data: ProfileFF) => {
    onSubmit(data);
  };

  return (
    <form
      className="rounded-[12px] border border-border bg-card p-6.5 [@media(max-width:560px)]:p-4.5"
      aria-label="Профиль и схема"
      onChange={(event) => {
        void handleSubmit(save)(event);
      }}
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="mb-5 flex items-center justify-between gap-4.5">
        <h2 className="text-[18px] font-[550]">Профиль</h2>
      </div>

      <div className="grid grid-cols-3 gap-5 [@media(max-width:800px)]:grid-cols-1">
        <div className="flex min-w-0 flex-col gap-2 text-[12px]">
          <label className="text-foreground" htmlFor={`${fieldId}-name`}>
            Ваше имя
          </label>

          <Input
            {...register("name")}
            id={`${fieldId}-name`}
            required
            maxLength={120}
            pattern=".*\S.*"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${fieldId}-name-error` : undefined}
          />

          {errors.name && (
            <span id={`${fieldId}-name-error`} className="text-destructive" role="alert">
              {errors.name.message}
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-2 text-[12px]">
          <label className="text-foreground" htmlFor={`${fieldId}-role`}>
            Роль
          </label>

          <Input
            {...register("role")}
            id={`${fieldId}-role`}
            required
            maxLength={120}
            pattern=".*\S.*"
            aria-invalid={Boolean(errors.role)}
            aria-describedby={errors.role ? `${fieldId}-role-error` : undefined}
          />

          {errors.role && (
            <span id={`${fieldId}-role-error`} className="text-destructive" role="alert">
              {errors.role.message}
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-2 text-[12px]">
          <label className="text-foreground" htmlFor={`${fieldId}-schema`}>
            Название схемы
          </label>

          <Input
            {...register("schemaName")}
            id={`${fieldId}-schema`}
            required
            maxLength={120}
            pattern=".*\S.*"
            aria-invalid={Boolean(errors.schemaName)}
            aria-describedby={errors.schemaName ? `${fieldId}-schema-error` : undefined}
          />

          {errors.schemaName && (
            <span id={`${fieldId}-schema-error`} className="text-destructive" role="alert">
              {errors.schemaName.message}
            </span>
          )}
        </div>
      </div>
    </form>
  );
};

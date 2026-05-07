import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  secondary?: ReactNode;
};

export function PageHeader({
  title,
  description,
  action,
  secondary,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2">
        <h1 className="text-[28px] font-semibold leading-9 text-[#111111]">
          {title}
        </h1>
        {description ? (
          <p className="max-w-2xl text-[15px] leading-6 text-[#525252]">
            {description}
          </p>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2">
        {secondary}
        {action}
      </div>
    </div>
  );
}

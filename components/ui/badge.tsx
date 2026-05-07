import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex h-6 items-center rounded-full border px-2 text-[13px] font-medium leading-none",
  {
    variants: {
      variant: {
        default: "border-[#E5E5E5] bg-[#FAFAFA] text-[#525252]",
        success: "border-[#BBF7D0] bg-[#F0FDF4] text-[#166534]",
        warning: "border-[#FDE68A] bg-[#FFFBEB] text-[#92400E]",
        error: "border-[#FECACA] bg-[#FEF2F2] text-[#991B1B]",
        info: "border-[#CBD5E1] bg-[#F1F5F9] text-[#1F3A5F]",
        accent: "border-[#C8DCD4] bg-[#EEF5F2] text-[#2F5D50]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  href?: string;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  href,
}: EmptyStateProps) {
  return (
    <Card className="flex min-h-[260px] flex-col items-start justify-center">
      <div className="max-w-md space-y-3">
        <h2 className="text-xl font-semibold leading-7 text-[#111111]">{title}</h2>
        <p className="text-[15px] leading-6 text-[#525252]">{description}</p>
        {href && actionLabel ? (
          <Button asChild className="mt-3">
            <Link href={href}>{actionLabel}</Link>
          </Button>
        ) : null}
      </div>
    </Card>
  );
}

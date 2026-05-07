import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-9 w-56 animate-pulse rounded-sm bg-[#F5F5F5]" />
      <Card className="space-y-4">
        <div className="h-5 w-1/3 animate-pulse rounded-sm bg-[#F5F5F5]" />
        <div className="h-4 w-2/3 animate-pulse rounded-sm bg-[#F5F5F5]" />
        <div className="h-4 w-1/2 animate-pulse rounded-sm bg-[#F5F5F5]" />
      </Card>
    </div>
  );
}

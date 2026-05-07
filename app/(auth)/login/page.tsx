import { LoginForm } from "@/components/forms/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-[#737373]">
            Vermieter Cockpit
          </p>
          <h1 className="text-[32px] font-semibold leading-10 text-[#111111]">
            Willkommen zurueck
          </h1>
          <p className="text-[15px] leading-6 text-[#525252]">
            Melde dich an und behalte deine Wohnungen im Blick.
          </p>
        </div>
        <LoginForm next={params.next} />
      </div>
    </main>
  );
}

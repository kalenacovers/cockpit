import { RegisterForm } from "@/components/forms/register-form";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-[#737373]">
            Vermieter Cockpit
          </p>
          <h1 className="text-[32px] font-semibold leading-10 text-[#111111]">
            Konto erstellen
          </h1>
          <p className="text-[15px] leading-6 text-[#525252]">
            Richte dein Vermieter-Cockpit in wenigen Minuten ein.
          </p>
        </div>
        <RegisterForm />
      </div>
    </main>
  );
}

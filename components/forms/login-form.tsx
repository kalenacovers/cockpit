"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signInAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(signInAction, {});

  return (
    <Card>
      <CardContent>
        <form action={action} className="space-y-4">
          <input type="hidden" name="next" value={next ?? ""} />
          <div className="space-y-2">
            <Label htmlFor="email">E-Mail</Label>
            <Input id="email" name="email" type="email" autoComplete="email" />
            {state.fieldErrors?.email ? (
              <p className="text-sm text-[#991B1B]">
                {state.fieldErrors.email[0]}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Passwort</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
            />
            {state.fieldErrors?.password ? (
              <p className="text-sm text-[#991B1B]">
                {state.fieldErrors.password[0]}
              </p>
            ) : null}
          </div>
          {state.message ? (
            <p className="text-sm text-[#991B1B]">{state.message}</p>
          ) : null}
          <Button type="submit" className="w-full" disabled={pending}>
            Anmelden
          </Button>
          <p className="text-center text-sm text-[#737373]">
            Noch kein Konto?{" "}
            <Link className="font-medium text-[#111111] underline" href="/register">
              Konto erstellen
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

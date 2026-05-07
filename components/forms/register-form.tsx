"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUpAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm() {
  const [state, action, pending] = useActionState(signUpAction, {});

  return (
    <Card>
      <CardContent>
        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Name</Label>
            <Input id="full_name" name="full_name" autoComplete="name" />
            {state.fieldErrors?.full_name ? (
              <p className="text-sm text-[#991B1B]">
                {state.fieldErrors.full_name[0]}
              </p>
            ) : null}
          </div>
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
              autoComplete="new-password"
            />
            {state.fieldErrors?.password ? (
              <p className="text-sm text-[#991B1B]">
                {state.fieldErrors.password[0]}
              </p>
            ) : null}
          </div>
          {state.message ? (
            <p
              className={
                state.ok ? "text-sm text-[#166534]" : "text-sm text-[#991B1B]"
              }
            >
              {state.message}
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={pending}>
            Konto erstellen
          </Button>
          <p className="text-center text-sm text-[#737373]">
            Schon ein Konto?{" "}
            <Link className="font-medium text-[#111111] underline" href="/login">
              Anmelden
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

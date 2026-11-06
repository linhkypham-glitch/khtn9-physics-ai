"use client";

import { useActionState } from "react";
import { Loader2, LogIn } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInAction, type LoginState } from "./actions";

const initialState: LoginState = { error: null };

export function LoginForm({ next, disabled }: { next: string; disabled: boolean }) {
  const [state, formAction, pending] = useActionState(signInAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <input type="hidden" name="next" value={next} />
      {state.error && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      <div className="flex flex-col gap-2">
        <Label htmlFor="identifier">Email</Label>
        <Input
          id="identifier"
          name="identifier"
          type="text"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="ten@truong.edu.vn"
          defaultValue={state.identifier}
          aria-invalid={Boolean(state.fieldErrors?.identifier)}
          aria-describedby={state.fieldErrors?.identifier ? "identifier-error" : undefined}
          disabled={disabled}
          required
        />
        {state.fieldErrors?.identifier && (
          <p id="identifier-error" className="text-sm text-destructive">{state.fieldErrors.identifier}</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Mật khẩu</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(state.fieldErrors?.password)}
          aria-describedby={state.fieldErrors?.password ? "password-error" : undefined}
          disabled={disabled}
          required
        />
        {state.fieldErrors?.password && (
          <p id="password-error" className="text-sm text-destructive">{state.fieldErrors.password}</p>
        )}
      </div>
      <Button type="submit" size="lg" disabled={pending || disabled} className="mt-2">
        {pending ? <Loader2 className="animate-spin" /> : <LogIn />}
        {pending ? "Đang đăng nhập..." : "Đăng nhập"}
      </Button>
    </form>
  );
}

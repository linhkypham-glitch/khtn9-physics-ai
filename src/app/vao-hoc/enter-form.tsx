"use client";

import { useActionState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { enterClassAction, type EnterState } from "./actions";

const initial: EnterState = { error: null };

export function EnterForm({ classNames, disabled }: { classNames: string[]; disabled: boolean }) {
  const [state, action, pending] = useActionState(enterClassAction, initial);
  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      {state.error && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      <div className="flex flex-col gap-2">
        <Label htmlFor="fullName" className="text-base">Họ và tên</Label>
        <Input
          id="fullName"
          name="fullName"
          autoComplete="name"
          placeholder="Ví dụ: Nguyễn Văn An"
          defaultValue={state.values?.fullName}
          aria-invalid={Boolean(state.fieldErrors?.fullName)}
          disabled={disabled}
          className="h-12 text-base"
          required
        />
        {state.fieldErrors?.fullName && <p className="text-sm text-destructive">{state.fieldErrors.fullName}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="className" className="text-base">Lớp</Label>
        <Input
          id="className"
          name="className"
          list="class-suggestions"
          autoComplete="off"
          autoCapitalize="characters"
          placeholder="Ví dụ: 9A"
          defaultValue={state.values?.className}
          aria-invalid={Boolean(state.fieldErrors?.className)}
          disabled={disabled}
          className="h-12 text-base uppercase"
          required
        />
        <datalist id="class-suggestions">
          {classNames.map((n) => (
            <option key={n} value={n} />
          ))}
        </datalist>
        {state.fieldErrors?.className && <p className="text-sm text-destructive">{state.fieldErrors.className}</p>}
        {classNames.length > 0 && (
          <p className="text-xs text-muted-foreground">Các lớp đã có: {classNames.join(", ")}</p>
        )}
      </div>
      <Button type="submit" size="lg" disabled={pending || disabled} className="h-12 bg-gradient-to-r from-orange-600 to-amber-500 text-base shadow-lg shadow-orange-500/30 hover:from-orange-700 hover:to-amber-600">
        {pending ? <Loader2 className="animate-spin" /> : null}
        {pending ? "Đang vào lớp..." : "Vào học"}
        {!pending && <ArrowRight />}
      </Button>
    </form>
  );
}

import { Suspense } from "react";
import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
          Loading sign in...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

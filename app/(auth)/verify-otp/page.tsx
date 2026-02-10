import { Suspense } from "react";
import VerifyOtpForm from "./verify-otp-form";

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
          Loading verification...
        </div>
      }
    >
      <VerifyOtpForm />
    </Suspense>
  );
}

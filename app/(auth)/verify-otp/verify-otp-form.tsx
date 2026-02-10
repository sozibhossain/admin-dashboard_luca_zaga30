"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { verifyOtp } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function VerifyOtpForm() {
  const router = useRouter();
  const params = useSearchParams();
  const initialEmail = params.get("email") ?? "";
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");

  const mutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: (response) => {
      toast.success(response.message || "OTP verified");
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to verify OTP";
      toast.error(message);
    },
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Verify OTP</CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter the OTP sent to your email.
        </p>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            mutation.mutate({ email, otp });
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="otp">OTP</Label>
            <Input
              id="otp"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>
        <div className="mt-4 text-sm">
          <Link className="text-brand" href="/login">
            Back to sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

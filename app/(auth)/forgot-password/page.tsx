"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { forgotPassword } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("sozibbdcalling2025@gmail.com");

  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (response) => {
      toast.success(response.message || "OTP sent to email");
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to send OTP";
      toast.error(message);
    },
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Forgot password</CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter your email and we will send an OTP.
        </p>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            mutation.mutate({ email });
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
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Sending..." : "Send OTP"}
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

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-3xl font-semibold">Access denied</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Your account does not have the required role for this admin dashboard.
      </p>
      <Button asChild>
        <Link href="/login">Return to sign in</Link>
      </Button>
    </div>
  );
}

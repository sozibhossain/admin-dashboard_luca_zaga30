"use client";

import { useState } from "react"; // Added for state management
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/components/layout/nav-items";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
// Assuming you have these Shadcn components installed:
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";

export default function Sidebar() {
  const pathname = usePathname();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const handleLogout = () => {
    // Add your logout logic here (e.g., signOut() from Auth.js)
    console.log("Logging out...");
    setIsLogoutOpen(false);
  };

  return (
    <aside className="hidden h-screen w-64 flex-col gap-6 border-r border-border bg-brand px-6 py-8 text-brand-foreground lg:flex">
      <div className="flex items-center justify-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={100}
          height={100}
          className="h-[100px] w-[80px]"
        />
      </div>

      <Button className="w-full border border-white/20 bg-brand text-brand-foreground hover:bg-brand/90">
        Add Property
      </Button>

      <Separator className="bg-white/15" />

      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-white/80 transition-colors hover:bg-white/15",
                isActive && "bg-white/20 text-white",
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout Section with Modal */}
      <div className="rounded-2xl bg-white/10 p-4 text-xs text-white/70">
        <AlertDialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-white/20 text-white/80 hover:bg-white/15"
            >
              Logout
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white text-slate-900">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to logout?
              </AlertDialogTitle>
              <AlertDialogDescription>
                You will need to log back in to manage your properties.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-slate-200">
                No, stay
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogout}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Yes, logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </aside>
  );
}

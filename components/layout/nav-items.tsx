import {
  Building2,
  CreditCard,
  LayoutDashboard,
  Settings,
  Users2,
} from "lucide-react";

export const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/users", label: "Users", icon: Users2 },
  { href: "/properties", label: "Properties", icon: Building2 },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

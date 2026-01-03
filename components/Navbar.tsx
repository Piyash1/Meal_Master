"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  Utensils,
  CreditCard,
  Wallet,
  FileText,
  LucideIcon,
  LogOut,
  User as UserIcon,
  Settings,
} from "lucide-react";
import { cn } from "../lib/utils";
import { logout } from "@/app/actions/auth";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/members", label: "Members", icon: Users },
  { href: "/meals", label: "Meal Entry", icon: Utensils },
  { href: "/expenses", label: "Expenses", icon: CreditCard },
  { href: "/deposits", label: "Deposits", icon: Wallet },
  { href: "/report", label: "Report", icon: FileText },
];

export function Navbar({ user }: { user?: any }) {
  const pathname = usePathname();

  // Don't show navbar on login page
  if (pathname === "/login") return null;

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="shrink-0">
              <span className="text-xl font-bold bg-linear-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                MealMaster
              </span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-1">
                {navItems
                  .filter((item) => {
                    if (user?.role === "MEMBER") {
                      return item.label === "Dashboard";
                    }
                    return true;
                  })
                  .map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                          pathname === item.href
                            ? "bg-slate-800 text-white"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </Link>
                    );
                  })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50">
              <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <UserIcon className="w-3 h-3 text-indigo-400" />
              </div>
              <span className="text-xs font-semibold text-slate-300">
                {user?.role || "Member"}
              </span>
            </div>

            {user?.role === "ADMIN" && (
              <Link
                href="/settings"
                className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-all"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </Link>
            )}

            <form action={logout}>
              <button
                type="submit"
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile Nav (Visible only on small screens) */}
      <div className="md:hidden bg-slate-900 border-t border-slate-800 fixed bottom-0 left-0 right-0 z-50">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems
            .filter((item) => {
              if (user?.role === "MEMBER") {
                return item.label === "Dashboard";
              }
              return true;
            })
            .map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 transition-colors flex-1",
                    pathname === item.href
                      ? "text-indigo-400"
                      : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
              );
            })}
        </div>
      </div>
    </nav>
  );
}

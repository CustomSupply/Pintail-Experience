"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  MapPin,
  Megaphone,
  Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/roster", label: "Roster", icon: Users },
  { href: "/admin/trips", label: "Trips", icon: MapPin },
  { href: "/admin/broadcast", label: "Broadcast", icon: Megaphone },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="md:flex md:w-60 md:shrink-0 md:flex-col md:border-r md:border-border md:bg-sidebar md:px-3 md:py-6">
      <Link
        href="/admin"
        className="mb-6 hidden px-3 font-heading text-lg italic tracking-tight text-primary md:block"
      >
        Pintail · Admin
      </Link>
      <ul className="flex justify-around gap-1 border-b border-border bg-sidebar p-2 md:flex-col md:justify-start md:border-0 md:bg-transparent md:p-0">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <li key={href} className="md:w-full">
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-md px-3 py-2 text-xs md:flex-row md:gap-3 md:text-sm",
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-5 md:size-4" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

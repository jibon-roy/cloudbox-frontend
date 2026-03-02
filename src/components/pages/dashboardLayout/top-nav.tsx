"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import NotificationDetails from "./NotificationDetails";
import UserDropdown from "../../shared/NavBar/UserDropdown";
import ThemeButton from "../../ui/theme/ThemeButton";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function TopNav() {
  const pathname = usePathname();
  const last = pathname.split("/").filter(Boolean).at(-1) ?? "dashboard";

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "CloudBox", href: "/" },
    { label: last.charAt(0).toUpperCase() + last.slice(1) },
  ];

  return (
    <nav className="flex h-full items-center justify-between bg-surface px-3 sm:px-4 lg:px-6">
      <div className="hidden max-w-75 items-center space-x-1 truncate text-sm font-medium lg:flex">
        {breadcrumbs.map((item, index) => (
          <div key={item.label} className="flex items-center">
            {index > 0 && <ChevronRight className="mx-1 h-4 w-4 text-muted" />}
            {item.href ? (
              <Link
                href={item.href}
                className="text-muted transition-colors hover:text-app-text"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-app-text">{item.label}</span>
            )}
          </div>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <ThemeButton />
        {/* <NotificationDetails /> */}
        <UserDropdown />
      </div>
    </nav>
  );
}

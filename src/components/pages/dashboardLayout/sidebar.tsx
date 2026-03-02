/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  BarChart2,
  Building2,
  CreditCard,
  Folder,
  Home,
  LogOut,
  Menu,
  Package,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { logoutHandler } from "@/src/utils/handleLogout";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import Logo from "../../ui-library/logo";

function NavItem({
  href = "#",
  icon: Icon,
  children,
  onClick,
}: {
  href?: string;
  icon?: React.ComponentType<any>;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center rounded-xl px-3 py-2 text-sm transition-colors lg:text-base ${
        isActive
          ? "bg-primary text-text-inverse"
          : "text-muted hover:bg-surface-soft hover:text-app-text"
      }`}
    >
      {Icon && <Icon className="mr-3 h-5 w-5 shrink-0" />}
      {children}
    </Link>
  );
}

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    logoutHandler(dispatch, router);
    window.dispatchEvent(new Event("logout"));
  };

  const closeMobile = () => setIsMobileMenuOpen(false);

  return (
    <>
      <button
        type="button"
        className="fixed left-3 top-3 z-40 cursor-pointer rounded-lg border border-border-subtle bg-surface p-2 lg:hidden"
        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
      >
        <Menu className="h-5 w-5 text-app-text" />
      </button>

      <nav
        className={`fixed inset-y-0 left-0 z-50 h-screen max-h-screen w-70 transform overflow-y-auto border-r border-border-subtle bg-surface transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div
            onClick={closeMobile}
            className="flex h-16 items-center border-b border-border-subtle px-5"
          >
            <Logo />
          </div>

          <div className="flex-1 p-4">
            <div className="space-y-1">
              <NavItem href="/dashboard" icon={Home} onClick={closeMobile}>
                Dashboard
              </NavItem>
              {/* file manager */}
              <NavItem
                href="/dashboard/file-manager"
                icon={Folder}
                onClick={closeMobile}
              >
                File Manager
              </NavItem>
              <NavItem
                href="/dashboard/my-subscription"
                icon={Package}
                onClick={closeMobile}
              >
                My Subscription
              </NavItem>
              <NavItem
                href="/dashboard/billing-history"
                icon={CreditCard}
                onClick={closeMobile}
              >
                Billing History
              </NavItem>
              <NavItem
                href="/dashboard/user-settings"
                icon={Settings}
                onClick={closeMobile}
              >
                Settings
              </NavItem>
            </div>
          </div>

          <div className="border-t border-border-subtle p-4">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center rounded-xl px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-soft hover:text-app-text lg:text-base"
            >
              <LogOut className="mr-3 h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <button
          type="button"
          aria-label="close menu backdrop"
          className="fixed inset-0 z-40 bg-black/35 lg:hidden"
          onClick={closeMobile}
        />
      )}
    </>
  );
}

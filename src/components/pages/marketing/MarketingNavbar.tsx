"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import MarketingButton from "./MarketingButton";
import dynamic from "next/dynamic";
import Logo from "../../ui-library/logo";
import { useAppSelector } from "@/src/redux/hooks";
import {
  selectCurrentUser,
  selectCurrentToken,
} from "@/src/redux/features/auth/authSlice";
import UserDropdown from "../../shared/NavBar/UserDropdown";

const ThemeSwitch = dynamic(() => import("../../ui/theme/ThemeSwitch"), {
  ssr: false,
});

const navItems = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const MarketingNavbar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const user = useAppSelector(selectCurrentUser);
  const token = useAppSelector(selectCurrentToken);
  const isLoggedIn = Boolean(user && token);

  const userName = user?.full_name || user?.email || "User";
  const userRole = user?.role || "User";
  const userAvatar = user?.profile_image_url || "/user.png";

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-surface/90 backdrop-blur-lg">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-3 lg:px-10">
        <Logo />

        <div className="hidden items-center gap-1 rounded-full border border-border-subtle bg-surface-soft p-1 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  active
                    ? "bg-surface text-app-text shadow-sm"
                    : "text-muted hover:bg-surface hover:text-app-text"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <ThemeSwitch variant="toggle" />
            {isLoggedIn ? (
              <UserDropdown />
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Link href="/auth/login">
                  <MarketingButton variant="ghost">Log in</MarketingButton>
                </Link>
                <Link href="/auth/register">
                  <MarketingButton>Get Started</MarketingButton>
                </Link>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle menu"
            className="rounded-xl border border-border-subtle bg-surface p-2 text-app-text md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border-subtle bg-surface md:hidden"
          >
            <div className="space-y-2 px-5 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg bg-surface-soft px-3 py-2 text-sm text-app-text"
                >
                  {item.label}
                </Link>
              ))}
              {isLoggedIn ? (
                ""
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link href="/auth/login" onClick={() => setOpen(false)}>
                    <MarketingButton variant="outline" className="w-full">
                      Log in
                    </MarketingButton>
                  </Link>
                  <Link href="/auth/register" onClick={() => setOpen(false)}>
                    <MarketingButton className="w-full">
                      Sign up
                    </MarketingButton>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
};

export default MarketingNavbar;

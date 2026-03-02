"use client";

import { Bell, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function NotificationDetails() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div>
      <button
        type="button"
        className="cursor-pointer rounded-full border border-border-subtle p-1.5 transition-colors hover:bg-surface-soft sm:p-2"
        onClick={toggleDrawer}
      >
        <Bell className="h-4 w-4 text-muted sm:h-5 sm:w-5" />
      </button>

      <div
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-80 transform bg-surface shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border-subtle p-4">
          <h3 className="text-lg font-semibold text-app-text">Notifications</h3>
          <button
            type="button"
            onClick={toggleDrawer}
            className="rounded-full p-1 text-muted hover:bg-surface-soft"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-4">
          <ul className="space-y-2">
            {[
              "Upload completed",
              "New share link created",
              "Subscription updated",
            ].map((item) => (
              <li
                key={item}
                className="rounded-xl border border-border-subtle bg-surface-soft px-3 py-2"
              >
                <Link href="#" className="text-sm text-app-text">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        type="button"
        aria-label="notification backdrop"
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={toggleDrawer}
      />
    </div>
  );
}

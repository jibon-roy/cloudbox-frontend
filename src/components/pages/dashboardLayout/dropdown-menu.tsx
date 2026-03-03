// components/Dropdown.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Profile01 from "./profile-01";

interface DropdownMenuProps {
  children: React.ReactNode;
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  align?: string;
  sideOffset?: number;
  className?: string;
  onClose?: () => void;
  triggerRef?: React.RefObject<HTMLDivElement | null>;
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  className?: string;
}

export const DropdownMenuTrigger = ({
  children,
  className,
}: DropdownMenuTriggerProps) => {
  return <div className={className}>{children}</div>;
};

export const DropdownMenuContent = ({
  children,
  align = "start",
  sideOffset = 0,
  className = "",
  onClose,
  triggerRef,
}: DropdownMenuContentProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, right: 0 });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose?.(); // ✅ Close when clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    // Calculate position relative to trigger button
    const updatePosition = () => {
      if (triggerRef?.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + 8,
          left: align === "start" ? rect.left : 0,
          right: align === "end" ? window.innerWidth - rect.right : 0,
        });
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [align, triggerRef]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`fixed ${className}`}
      style={{
        top: `${position.top}px`,
        ...(align === "end"
          ? { right: `${position.right}px` }
          : { left: `${position.left}px` }),
        zIndex: 99999,
      }}
    >
      <div className="relative p-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl">
        {children}
      </div>
    </motion.div>
  );
};

export const DropdownMenu = ({ children }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative inline-block">
      <div ref={triggerRef} onMouseDown={() => setIsOpen(!isOpen)}>
        {children}
      </div>
      <AnimatePresence>
        {isOpen && (
          <DropdownMenuContent
            align="end"
            onClose={() => setIsOpen(false)}
            sideOffset={8}
            className="w-70 sm:w-80"
            triggerRef={triggerRef}
          >
            <Profile01 />
          </DropdownMenuContent>
        )}
      </AnimatePresence>
    </div>
  );
};

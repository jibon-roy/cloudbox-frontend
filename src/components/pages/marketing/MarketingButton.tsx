"use client";

import { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/src/lib/utils";

type MarketingButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
} & Omit<HTMLMotionProps<"button">, "children">;

const variantClasses: Record<
  NonNullable<MarketingButtonProps["variant"]>,
  string
> = {
  primary:
    "bg-primary text-text-inverse border border-primary hover:bg-primary-strong hover:border-primary-strong",
  secondary:
    "bg-secondary text-text-inverse border border-secondary hover:bg-secondary-strong hover:border-secondary-strong",
  outline:
    "bg-surface text-app-text border border-border-subtle hover:bg-surface-soft",
  ghost:
    "bg-transparent text-app-text border border-transparent hover:bg-surface-soft",
};

const MarketingButton = ({
  children,
  variant = "primary",
  className,
  ...props
}: MarketingButtonProps) => {
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-brand disabled:cursor-not-allowed disabled:opacity-55",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default MarketingButton;

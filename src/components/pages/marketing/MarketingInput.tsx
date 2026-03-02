import { InputHTMLAttributes } from "react";
import { cn } from "@/src/lib/utils";

type MarketingInputProps = {
  label: string;
  hint?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const MarketingInput = ({
  label,
  hint,
  className,
  id,
  ...props
}: MarketingInputProps) => {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-2">
      <label
        htmlFor={fieldId}
        className="block text-sm font-medium text-app-text"
      >
        {label}
      </label>
      <input
        id={fieldId}
        className={cn(
          "w-full rounded-xl border border-border-subtle bg-surface px-4 py-2.5 text-sm text-app-text outline-none transition-all duration-300 placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-ring-brand",
          className,
        )}
        {...props}
      />
      {hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  );
};

export default MarketingInput;

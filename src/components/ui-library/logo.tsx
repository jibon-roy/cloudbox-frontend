import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <div>
      <Link href="/" className="flex items-center gap-2">
        <img src="/logo.png" alt="logo" className="h-9 w-9 bg-white rounded-xl" />
        <div>
          <p className="text-base font-bold text-app-text">CloudBox</p>
          <p className="text-[11px] text-muted">Secure file workspace</p>
        </div>
      </Link>
    </div>
  );
};

export default Logo;

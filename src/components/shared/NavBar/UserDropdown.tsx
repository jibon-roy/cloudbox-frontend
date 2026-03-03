"use client";
import { useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "../../pages/dashboardLayout/dropdown-menu";
import { RootState } from "@/src/redux/store";

const UserDropdown = ({ className }: { className?: string }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user) {
    return <div></div>;
  }

  // Helper to get avatar URL with fallback

  const userName = user?.full_name || user?.name || user?.email || "User";
  const userAvatar = user?.avatar_url || "/user.png";

  return (
    <div className={`relative flex items-center ${className || ""}`}>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <div className="flex items-center gap-2">
            <img
              src={userAvatar}
              alt={`${userName}'s avatar`}
              onError={(e) => (e.currentTarget.src = "/user.png")}
              width={28}
              height={28}
              className="rounded-full ring-2 ring-gray-200 dark:ring-[#2B2B30] w-9 h-9 cursor-pointer"
            />
          </div>
        </DropdownMenuTrigger>
      </DropdownMenu>
    </div>
  );
};

export default UserDropdown;

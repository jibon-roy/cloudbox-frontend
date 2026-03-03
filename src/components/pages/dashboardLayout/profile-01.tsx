import { logoutHandler } from "@/src/utils/handleLogout";
import { LogOut, MoveUpRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RxDashboard } from "react-icons/rx";
import { RootState } from "@/src/redux/store";

interface MenuItem {
  label: string;
  value?: string;
  href: string;
  icon?: React.ReactNode;
  external?: boolean;
}

export default function Profile01() {
  const menuItems: MenuItem[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <RxDashboard className="w-4 h-4" />,
    },
  ];

  const router = useRouter();
  const dispatch = useDispatch();
  const handleLogout = () => {
    logoutHandler(dispatch, router);
    window.dispatchEvent(new Event("logout"));
  };

  const user = useSelector((state: RootState) => state.auth.user);
  const subscription = useSelector(
    (state: RootState) => state.auth.subscription,
  );

  // Helper to get avatar URL with fallback

  // Get user data from Redux with fallbacks
  const userName = user?.full_name || user?.name || user?.email || "User";
  const userRole = user?.role || subscription?.plan || "Free Plan";
  const userAvatar = user?.avatar_url || "/user.png";

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="relative overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <div className="relative px-4 py-4">
          <div className="flex items-center gap-4 mb-4 md:mb-6">
            <div className="relative shrink-0">
              <img
                src={userAvatar}
                onError={(e) => (e.currentTarget.src = "/user.png")}
                alt={userName}
                width={72}
                height={72}
                className="rounded-full ring-4 w-12 h-12 ring-white  object-cover"
              />
              <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white " />
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {userName}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">{userRole}</p>
            </div>
          </div>
          <div className="h-px bg-zinc-200 dark:bg-zinc-700 my-3" />
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center justify-between p-2 
                                    hover:bg-zinc-50 dark:hover:bg-zinc-800/50 
                                    rounded-lg transition-colors duration-200"
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span className="text-sm lg:text-base font-medium text-zinc-700 dark:text-zinc-300">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center">
                  {item.value && (
                    <span className="text-sm text-zinc-500 dark:text-zinc-400 mr-2">
                      {item.value}
                    </span>
                  )}
                  {item.external && <MoveUpRight className="w-4 h-4" />}
                </div>
              </Link>
            ))}

            <button
              type="button"
              className="w-full flex items-center justify-between p-2 
                                hover:bg-zinc-50 dark:hover:bg-zinc-800/50
                                rounded-lg transition-colors duration-200"
            >
              <div className="flex items-center gap-2" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                <span className="text-sm lg:text-base font-medium text-zinc-700 dark:text-zinc-300">
                  Logout
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

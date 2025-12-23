import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  LogOut,
  Users,
  PieChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { TokenPayload } from "@/lib/auth";

interface SidebarProps {
  session: TokenPayload | null;
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const Sidebar = ({ session, isCollapsed, setIsCollapsed }: SidebarProps) => {
  const pathname = usePathname();

  const navItems = [
    // Admin-specific items
    ...(session?.role === "admin"
      ? [
          {
            name: "Dashboard",
            href: "/admin",
            icon: LayoutDashboard,
            description: "Overview & Stats",
            roles: ["admin"],
          },
          {
            name: "New Response",
            href: "/form",
            icon: FileText,
            description: "Data Entry",
            roles: ["admin"],
          },
          {
            name: "All Responses",
            href: "/admin/responses",
            icon: Users,
            description: "Manage All Entries",
            roles: ["admin"],
          },
          {
            name: "Analytics",
            href: "/admin/reports",
            icon: BarChart3,
            description: "Visual Reports",
            roles: ["admin"],
          },
          {
            name: "Export Data",
            href: "/admin/export",
            icon: PieChart,
            description: "Download CSV/PDF",
            roles: ["admin"],
          },
          {
            name: "Settings",
            href: "/admin/settings",
            icon: Settings,
            description: "System & Database",
            roles: ["admin"],
          },
        ]
      : []),
    // Volunteer-specific items
    ...(session?.role === "volunteer"
      ? [
          {
            name: "Dashboard",
            href: "/volunteer/dashboard",
            icon: LayoutDashboard,
            description: "Your Activity Overview",
            roles: ["volunteer"],
          },
          {
            name: "New Response",
            href: "/form",
            icon: FileText,
            description: "Data Entry",
            roles: ["volunteer"],
          },
          {
            name: "All Responses",
            href: "/volunteer/responses",
            icon: Users,
            description: "Manage Your Entries",
            roles: ["volunteer"],
          },
        ]
      : []),
  ].filter(
    (item) => !item.roles || (session && item.roles.includes(session.role))
  );

  return (
    <aside
      className={`no-print fixed left-0 top-0 z-40 h-screen border-r border-gray-200 bg-white transition-all duration-300 shadow-sm ${
        isCollapsed ? "w-20" : "w-72"
      }`}
    >
      <div className="flex h-full flex-col relative">
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-24 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm hover:text-blue-600 hover:border-blue-200 transition-all"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Logo Section */}
        <div
          className={`flex h-20 items-center border-b border-gray-100 transition-all duration-300 ${
            isCollapsed ? "px-4 justify-center" : "px-8"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 min-w-[32px] rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30">
              C
            </div>
            {!isCollapsed && (
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate">
                CCC Eval
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 px-3 py-8 overflow-y-auto overflow-x-hidden">
          {!isCollapsed && (
            <div className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider truncate">
              Main Menu
            </div>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.name}
                href={item.href}
                title={isCollapsed ? item.name : undefined}
                className={`group flex items-center gap-3 rounded-xl transition-all duration-200 ${
                  isCollapsed ? "px-3 py-3 justify-center" : "px-4 py-3.5"
                } ${
                  isActive
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
                }`}
              >
                <Icon
                  size={20}
                  className={`${
                    isActive
                      ? "text-blue-600"
                      : "text-gray-400 group-hover:text-gray-600"
                  } min-w-[20px] transition-colors`}
                />
                {!isCollapsed && (
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate font-medium">{item.name}</span>
                    {isActive && (
                      <span className="text-[10px] text-blue-400 font-normal leading-tight truncate">
                        {item.description}
                      </span>
                    )}
                  </div>
                )}
                {isActive && !isCollapsed && (
                  <div className="ml-auto w-1.5 h-1.5 min-w-[6px] rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User / Logout Section */}
        <div
          className={`m-3 rounded-2xl bg-gray-50 border border-gray-100 transition-all duration-300 ${
            isCollapsed ? "p-2" : "p-4"
          }`}
        >
          <div
            className={`flex items-center gap-3 mb-3 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="h-10 w-10 min-w-[40px] rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border-2 border-white shadow-sm">
              {session?.username.charAt(0).toUpperCase() || "U"}
            </div>
            {!isCollapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-sm font-semibold text-gray-900">
                  {session?.username || "Current User"}
                </span>
                <span className="truncate text-xs text-gray-500">
                  {session?.role || "User"}
                </span>
              </div>
            )}
          </div>

          <button
            title={isCollapsed ? "Sign Out" : undefined}
            className={`flex items-center justify-center gap-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all shadow-sm ${
              isCollapsed ? "w-full p-2" : "w-full px-3 py-2"
            }`}
            onClick={async () => {
              // Call logout API
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/login";
            }}
          >
            <LogOut size={16} className="min-w-[16px]" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

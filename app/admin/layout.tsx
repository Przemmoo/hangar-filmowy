"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  FileText, 
  Image, 
  Mail, 
  Settings,
  Film,
  LogOut
} from "lucide-react";
import { signOut } from "next-auth/react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated" && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [status, pathname, router]);

  // Don't render layout for login page
  if (pathname === "/admin/login") {
    return children;
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-dark via-brand-blue to-brand-dark flex items-center justify-center">
        <div className="text-white text-xl">Ładowanie...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Zarządzanie Treścią",
      href: "/admin/content",
      icon: FileText,
    },
    {
      name: "Biblioteka Mediów",
      href: "/admin/media",
      icon: Image,
    },
    {
      name: "Formularze",
      href: "/admin/submissions",
      icon: Mail,
    },
    {
      name: "Ustawienia",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-dark via-brand-blue to-brand-dark">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-brand-dark/90 backdrop-blur-xl border-r border-white/10">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center space-x-3 px-6 py-6 border-b border-white/10">
            <img 
              src="/hangar_filmowy.svg" 
              alt="Hangar Filmowy Logo" 
              className="h-12 w-auto"
            />
            <div>
              <h1 className="text-lg font-bold text-white">Hangar Filmowy</h1>
              <p className="text-xs text-white/60 align-text-top">Panel Admin</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? "bg-brand-gold text-brand-dark font-medium"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User info + logout */}
          <div className="px-3 py-4 border-t border-white/10">
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {session.user?.name}
                </p>
                <p className="text-xs text-white/60 truncate">
                  {session.user?.email}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="ml-3 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition"
                title="Wyloguj"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="pl-64">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}

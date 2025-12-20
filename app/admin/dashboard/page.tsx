"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Film, LogOut, Users, Mail, Settings, BarChart3 } from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (status === "authenticated") {
      setIsLoading(false);
    }
  }, [status, router]);

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  if (isLoading || status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-dark via-brand-blue to-brand-dark flex items-center justify-center">
        <div className="text-white text-xl">Ładowanie...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-dark via-brand-blue to-brand-dark">
      {/* Header */}
      <header className="bg-brand-dark/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Film className="w-8 h-8 text-brand-gold" />
              <div>
                <h1 className="text-xl font-bold text-white">Panel Administracyjny</h1>
                <p className="text-xs text-white/60">Hangar Filmowy</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-white">{session?.user?.name}</p>
                <p className="text-xs text-white/60">{session?.user?.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Wyloguj</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-2">
            Witaj, {session?.user?.name}! 👋
          </h2>
          <p className="text-white/60">
            Zarządzaj stroną Hangar Filmowy z tego panelu
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <Mail className="w-8 h-8 text-brand-gold" />
              <span className="text-2xl font-bold text-white">0</span>
            </div>
            <h3 className="text-white/80 font-medium">Nowe zapytania</h3>
            <p className="text-white/40 text-sm">Z konfiguratora</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-brand-gold" />
              <span className="text-2xl font-bold text-white">0</span>
            </div>
            <h3 className="text-white/80 font-medium">Użytkownicy</h3>
            <p className="text-white/40 text-sm">W systemie</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-8 h-8 text-brand-gold" />
              <span className="text-2xl font-bold text-white">0</span>
            </div>
            <h3 className="text-white/80 font-medium">Odwiedziny</h3>
            <p className="text-white/40 text-sm">Ostatnie 7 dni</p>
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">Szybkie akcje</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <button className="bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-left transition group">
              <Mail className="w-10 h-10 text-brand-gold mb-4 group-hover:scale-110 transition" />
              <h4 className="text-white font-bold text-lg mb-2">Zapytania</h4>
              <p className="text-white/60 text-sm">Zobacz zgłoszenia z formularza</p>
            </button>

            <button className="bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-left transition group">
              <Film className="w-10 h-10 text-brand-gold mb-4 group-hover:scale-110 transition" />
              <h4 className="text-white font-bold text-lg mb-2">Galeria</h4>
              <p className="text-white/60 text-sm">Zarządzaj zdjęciami z eventów</p>
            </button>

            <button className="bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-left transition group">
              <Settings className="w-10 h-10 text-brand-gold mb-4 group-hover:scale-110 transition" />
              <h4 className="text-white font-bold text-lg mb-2">Ustawienia</h4>
              <p className="text-white/60 text-sm">Konfiguracja strony</p>
            </button>
          </div>
        </div>

        {/* Info banner */}
        <div className="mt-12 p-6 bg-brand-gold/10 border border-brand-gold/30 rounded-xl">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-brand-gold/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🚧</span>
              </div>
            </div>
            <div>
              <h4 className="text-brand-gold font-bold text-lg mb-2">Panel w budowie</h4>
              <p className="text-white/70 mb-4">
                Dashboard jest w fazie rozwoju. Funkcje będą dodawane sukcesywnie:
              </p>
              <ul className="space-y-2 text-white/60 text-sm">
                <li>✅ Autentykacja NextAuth.js - <span className="text-green-400">Gotowe</span></li>
                <li>🔄 Zarządzanie zapytaniami - W trakcie</li>
                <li>📋 Biblioteka mediów - Planowane</li>
                <li>⚙️ Edytor treści - Planowane</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

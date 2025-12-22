"use client";

import { useState, useEffect } from "react";
import { Film, FileText, Image, Send, TrendingUp, Clock, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";

interface Stats {
  totalSubmissions: number;
  newSubmissions: number;
  inProgressSubmissions: number;
  closedSubmissions: number;
  totalMediaFiles: number;
  recentSubmissions: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    createdAt: string;
  }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/dashboard");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center py-24">
          <Loader2 className="w-8 h-8 text-brand-gold animate-spin mx-auto mb-4" />
          <p className="text-white/60">Ładowanie danych...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-8">
        <div className="text-center py-24">
          <p className="text-white/60">Błąd ładowania danych</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Wszystkie Zgłoszenia",
      value: stats.totalSubmissions,
      icon: Send,
      color: "from-blue-500 to-blue-600",
      link: "/admin/submissions",
    },
    {
      label: "Nowe Zgłoszenia",
      value: stats.newSubmissions,
      icon: Clock,
      color: "from-brand-gold to-brand-orange",
      link: "/admin/submissions?status=NEW",
    },
    {
      label: "W Trakcie",
      value: stats.inProgressSubmissions,
      icon: TrendingUp,
      color: "from-yellow-500 to-orange-500",
      link: "/admin/submissions?status=IN_PROGRESS",
    },
    {
      label: "Zamknięte",
      value: stats.closedSubmissions,
      icon: CheckCircle,
      color: "from-gray-500 to-gray-600",
      link: "/admin/submissions?status=CLOSED",
    },
    {
      label: "Pliki Mediów",
      value: stats.totalMediaFiles,
      icon: Image,
      color: "from-purple-500 to-pink-500",
      link: "/admin/media",
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-white/60">Przegląd aktywności strony</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            href={stat.link}
            className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:border-brand-gold/30 hover:scale-105 transition group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-sm text-white/60">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent Submissions */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Ostatnie Zgłoszenia</h2>
          <Link
            href="/admin/submissions"
            className="text-sm text-brand-gold hover:text-brand-orange transition"
          >
            Zobacz wszystkie →
          </Link>
        </div>

        {stats.recentSubmissions.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/40">Brak zgłoszeń</p>
          </div>
        ) : (
          <div className="space-y-3">
            {stats.recentSubmissions.map((submission) => (
              <Link
                key={submission.id}
                href={`/admin/submissions`}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-brand-gold/30 transition group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-gold to-brand-orange flex items-center justify-center text-brand-dark font-bold">
                    {submission.firstName[0]}
                    {submission.lastName[0]}
                  </div>
                  <div>
                    <p className="text-white font-medium group-hover:text-brand-gold transition">
                      {submission.firstName} {submission.lastName}
                    </p>
                    <p className="text-sm text-white/60">{submission.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      submission.status === "NEW"
                        ? "bg-blue-500/20 text-blue-400"
                        : submission.status === "IN_PROGRESS"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {submission.status === "NEW"
                      ? "Nowe"
                      : submission.status === "IN_PROGRESS"
                      ? "W trakcie"
                      : "Zamknięte"}
                  </span>
                  <span className="text-sm text-white/40">
                    {new Date(submission.createdAt).toLocaleDateString("pl-PL")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Link
          href="/admin/content"
          className="bg-gradient-to-r from-brand-gold to-brand-orange p-6 rounded-xl hover:scale-105 transition group"
        >
          <FileText className="w-8 h-8 text-brand-dark mb-3" />
          <h3 className="text-xl font-bold text-brand-dark mb-2">
            Edytuj Treść
          </h3>
          <p className="text-brand-dark/80 text-sm">
            Zarządzaj tekstami na stronie głównej
          </p>
        </Link>

        <Link
          href="/admin/media"
          className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-xl hover:scale-105 transition group"
        >
          <Image className="w-8 h-8 text-white mb-3" />
          <h3 className="text-xl font-bold text-white mb-2">
            Biblioteka Mediów
          </h3>
          <p className="text-white/80 text-sm">
            Dodaj nowe zdjęcia i grafiki
          </p>
        </Link>

        <Link
          href="/admin/settings"
          className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 rounded-xl hover:scale-105 transition group"
        >
          <Film className="w-8 h-8 text-white mb-3" />
          <h3 className="text-xl font-bold text-white mb-2">Ustawienia</h3>
          <p className="text-white/80 text-sm">
            Konfiguruj SEO i dane kontaktowe
          </p>
        </Link>
      </div>
    </div>
  );
}

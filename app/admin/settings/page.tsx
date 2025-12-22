"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";

interface Settings {
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  linkedinUrl: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    contactEmail: "",
    contactPhone: "",
    contactAddress: "",
    facebookUrl: "",
    instagramUrl: "",
    youtubeUrl: "",
    linkedinUrl: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        showMessage("success", "Ustawienia zapisane pomyślnie!");
      } else {
        showMessage("error", "Błąd zapisu ustawień");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      showMessage("error", "Błąd zapisu ustawień");
    } finally {
      setIsSaving(false);
    }
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const updateSetting = (key: keyof Settings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center py-24">
          <Loader2 className="w-8 h-8 text-brand-gold animate-spin mx-auto mb-4" />
          <p className="text-white/60">Ładowanie ustawień...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Ustawienia Strony</h1>
          <p className="text-white/60">Zarządzaj globalnymi ustawieniami witryny</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-brand-gold to-brand-orange text-brand-dark font-semibold rounded-lg hover:scale-105 transition disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Zapisywanie...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Zapisz Zmiany</span>
            </>
          )}
        </button>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Contact Information */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-6">Dane Kontaktowe</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email kontaktowy
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => updateSetting("contactEmail", e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
                placeholder="pokaz@hangarfilmowy.pl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Numer telefonu
              </label>
              <input
                type="tel"
                value={settings.contactPhone}
                onChange={(e) => updateSetting("contactPhone", e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
                placeholder="+48 XXX XXX XXX"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-white mb-2">
                Adres firmy
              </label>
              <input
                type="text"
                value={settings.contactAddress}
                onChange={(e) => updateSetting("contactAddress", e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
                placeholder="Polska (zasięg ogólnopolski)"
              />
            </div>
          </div>
        </div>

        

        {/* SEO Settings */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-6">Ustawienia SEO</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Meta Title (50-60 znaków)
              </label>
              <input
                type="text"
                value={settings.seoTitle}
                onChange={(e) => updateSetting("seoTitle", e.target.value)}
                maxLength={60}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
                placeholder="Hangar Filmowy - Kino Plenerowe z Ekranami LED"
              />
              <p className="text-xs text-white/40 mt-1">
                {settings.seoTitle.length}/60 znaków
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Meta Description (150-160 znaków)
              </label>
              <textarea
                value={settings.seoDescription}
                onChange={(e) => updateSetting("seoDescription", e.target.value)}
                maxLength={160}
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none resize-none"
                placeholder="Profesjonalne kino plenerowe na Twoje wydarzenie..."
              />
              <p className="text-xs text-white/40 mt-1">
                {settings.seoDescription.length}/160 znaków
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Keywords (oddzielone przecinkami)
              </label>
              <textarea
                value={settings.seoKeywords}
                onChange={(e) => updateSetting("seoKeywords", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none resize-none"
                placeholder="kino plenerowe, wypożyczalnia ekranów LED, kino samochodowe..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

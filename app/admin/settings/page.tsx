"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Save, Loader2, UserPlus, Trash2, Edit2, Eye, EyeOff } from "lucide-react";

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

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const currentUserRole = (session?.user as any)?.role || 'editor';
  const currentUserId = session?.user?.id || '';
  const isAdmin = currentUserRole === 'admin';

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
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [userForm, setUserForm] = useState({
    email: "",
    name: "",
    password: "",
    role: "admin",
  });

  useEffect(() => {
    loadSettings();
    loadUsers();
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

  const loadUsers = async () => {
    // Edytorzy nie widzą listy użytkowników
    if (!isAdmin) {
      return;
    }
    
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error loading users:", error);
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

  const openUserModal = (user?: User) => {
    // Edytorzy mogą edytować tylko swoje konto
    if (!isAdmin && user && user.id !== currentUserId) {
      showMessage("error", "Brak uprawnień do edycji tego konta");
      return;
    }
    
    if (user) {
      setEditingUser(user);
      setUserForm({
        email: user.email,
        name: user.name,
        password: "",
        role: user.role,
      });
    } else {
      // Tylko administratorzy mogą tworzyć nowe konta
      if (!isAdmin) {
        showMessage("error", "Brak uprawnień do tworzenia kont");
        return;
      }
      setEditingUser(null);
      setUserForm({
        email: "",
        name: "",
        password: "",
        role: "admin",
      });
    }
    setShowUserModal(true);
    setShowPassword(false);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setEditingUser(null);
    setUserForm({ email: "", name: "", password: "", role: "admin" });
    setShowPassword(false);
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userForm.email || !userForm.name) {
      showMessage("error", "Email i imię są wymagane");
      return;
    }

    if (!editingUser && !userForm.password) {
      showMessage("error", "Hasło jest wymagane dla nowego użytkownika");
      return;
    }

    try {
      const method = editingUser ? "PUT" : "POST";
      const url = editingUser ? `/api/admin/users/${editingUser.id}` : "/api/admin/users";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userForm),
      });

      if (response.ok) {
        showMessage("success", editingUser ? "Użytkownik zaktualizowany" : "Użytkownik utworzony");
        loadUsers();
        closeUserModal();
      } else {
        const error = await response.json();
        showMessage("error", error.error || "Błąd zapisu użytkownika");
      }
    } catch (error) {
      showMessage("error", "Błąd zapisu użytkownika");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    // Tylko administratorzy mogą usuwać konta
    if (!isAdmin) {
      showMessage("error", "Brak uprawnień do usuwania kont");
      return;
    }
    
    if (!confirm("Czy na pewno chcesz usunąć tego użytkownika?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showMessage("success", "Użytkownik usunięty");
        loadUsers();
      } else {
        showMessage("error", "Błąd usuwania użytkownika");
      }
    } catch (error) {
      showMessage("error", "Błąd usuwania użytkownika");
    }
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

        {/* User Management */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {isAdmin ? "Zarządzanie Użytkownikami" : "Moje Konto"}
            </h2>
            {isAdmin && (
              <button
                onClick={() => openUserModal()}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-brand-gold to-brand-orange text-brand-dark font-semibold rounded-lg hover:scale-105 transition"
              >
                <UserPlus className="w-4 h-4" />
                <span>Dodaj Użytkownika</span>
              </button>
            )}
          </div>

          {isAdmin ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-white">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-white">Imię</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-white">Rola</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-white">Data utworzenia</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-white">Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4 text-sm text-white/80">{user.email}</td>
                      <td className="py-3 px-4 text-sm text-white/80">{user.name}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-brand-gold/20 text-brand-gold">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-white/60">
                        {new Date(user.createdAt).toLocaleDateString('pl-PL')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openUserModal(user)}
                            className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition"
                            title="Edytuj"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition"
                            title="Usuń"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="text-center py-8 text-white/40">
                  Brak użytkowników
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-white/60 mb-4">Edytuj swoje dane konta</p>
              <button
                onClick={async () => {
                  // Pobierz dane zalogowanego użytkownika
                  try {
                    const response = await fetch(`/api/admin/users/${currentUserId}`);
                    if (response.ok) {
                      const userData = await response.json();
                      openUserModal(userData);
                    }
                  } catch (error) {
                    showMessage("error", "Nie udało się pobrać danych użytkownika");
                  }
                }}
                className="px-6 py-3 bg-gradient-to-r from-brand-gold to-brand-orange text-brand-dark font-semibold rounded-lg hover:scale-105 transition"
              >
                Edytuj Moje Konto
              </button>
            </div>
          )}
        </div>
      </div>

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-brand-dark border border-white/10 rounded-xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-white mb-6">
              {editingUser ? "Edytuj Użytkownika" : "Dodaj Użytkownika"}
            </h3>
            
            <form onSubmit={handleUserSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
                  placeholder="admin@hangarfilmowy.pl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Imię *
                </label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
                  placeholder="Jan Kowalski"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Hasło {editingUser ? "(pozostaw puste aby nie zmieniać)" : "*"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    required={!editingUser}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {isAdmin && (
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Rola
                  </label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-500 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Edytor</option>
                  </select>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeUserModal}
                  className="flex-1 px-4 py-3 border border-white/10 text-white rounded-lg hover:bg-white/5 transition"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-brand-gold to-brand-orange text-brand-dark font-semibold rounded-lg hover:scale-105 transition"
                >
                  {editingUser ? "Zaktualizuj" : "Utwórz"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

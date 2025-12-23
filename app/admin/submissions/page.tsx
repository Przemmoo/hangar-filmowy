"use client";

import { useState, useEffect } from "react";
import { Mail, Eye, Trash2, Loader2, Search, Filter } from "lucide-react";

interface FormSubmission {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
  eventType: string;
  audienceSize: number;
  preferredDate?: string;
  extras: {
    popcorn: boolean;
    deckchairs: boolean;
    license: boolean;
  };
  estimatedLevel: string;
  status: string;
  createdAt: string;
}

const eventTypeLabels: Record<string, string> = {
  city: "Plener Miejski",
  corporate: "Event Firmowy",
  hotel: "Kino Samochodowe",
  festival: "Inne",
};

const statusLabels: Record<string, { label: string; color: string }> = {
  NEW: { label: "Nowe", color: "bg-blue-500" },
  IN_PROGRESS: { label: "W trakcie", color: "bg-yellow-500" },
  CONTACTED: { label: "Skontaktowano", color: "bg-purple-500" },
  CLOSED: { label: "Zamknięte", color: "bg-gray-500" },
};

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/submissions");
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      }
    } catch (error) {
      console.error("Error loading submissions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        await loadSubmissions();
        if (selectedSubmission?.id === id) {
          setSelectedSubmission({ ...selectedSubmission, status });
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm("Czy na pewno chcesz usunąć to zgłoszenie?")) return;

    try {
      const response = await fetch(`/api/admin/submissions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await loadSubmissions();
        if (selectedSubmission?.id === id) {
          setSelectedSubmission(null);
        }
      }
    } catch (error) {
      console.error("Error deleting submission:", error);
    }
  };

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesStatus = filterStatus === "all" || sub.status === filterStatus;
    const matchesSearch =
      searchQuery === "" ||
      sub.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Zgłoszenia Formularzowe</h1>
        <p className="text-white/60">Zarządzaj zapytaniami z konfiguratora eventów</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* List */}
        <div className="col-span-5">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            {/* Filters */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Szukaj po imieniu, nazwisku lub emailu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none appearance-none"
                >
                  <option value="all">Wszystkie</option>
                  <option value="NEW">Nowe</option>
                  <option value="IN_PROGRESS">W trakcie</option>
                  <option value="CONTACTED">Skontaktowano</option>
                  <option value="CLOSED">Zamknięte</option>
                </select>
              </div>
            </div>

            {/* List */}
            <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 text-brand-gold animate-spin mx-auto mb-4" />
                  <p className="text-white/60">Ładowanie...</p>
                </div>
              ) : filteredSubmissions.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60">Brak zgłoszeń</p>
                </div>
              ) : (
                filteredSubmissions.map((submission) => (
                  <button
                    key={submission.id}
                    onClick={() => setSelectedSubmission(submission)}
                    className={`w-full text-left p-4 rounded-lg transition ${
                      selectedSubmission?.id === submission.id
                        ? "bg-brand-gold/20 border border-brand-gold"
                        : "bg-white/5 border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-white font-medium">
                          {submission.firstName} {submission.lastName}
                        </h3>
                        <p className="text-white/60 text-sm">{submission.email}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs text-white ${
                          statusLabels[submission.status].color
                        }`}
                      >
                        {statusLabels[submission.status].label}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-white/60">
                      <span>{eventTypeLabels[submission.eventType] || submission.eventType}</span>
                      <span>•</span>
                      <span>{submission.audienceSize} osób</span>
                      <span>•</span>
                      <span>{new Date(submission.createdAt).toLocaleDateString("pl-PL")}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="col-span-7">
          {selectedSubmission ? (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6 pb-6 border-b border-white/10">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {selectedSubmission.firstName} {selectedSubmission.lastName}
                  </h2>
                  <p className="text-white/60">{selectedSubmission.email}</p>
                  {selectedSubmission.phone && (
                    <p className="text-white/60">{selectedSubmission.phone}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => deleteSubmission(selectedSubmission.id)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition"
                    title="Usuń"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-2">Status</label>
                <div className="flex space-x-2">
                  {Object.entries(statusLabels).map(([key, { label, color }]) => (
                    <button
                      key={key}
                      onClick={() => updateStatus(selectedSubmission.id, key)}
                      className={`px-4 py-2 rounded-lg transition ${
                        selectedSubmission.status === key
                          ? `${color} text-white`
                          : "bg-white/5 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-white">Szczegóły wydarzenia</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/60 text-sm mb-1">Rodzaj</p>
                    <p className="text-white">
                      {eventTypeLabels[selectedSubmission.eventType] || selectedSubmission.eventType}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm mb-1">Liczba widzów</p>
                    <p className="text-white">{selectedSubmission.audienceSize} osób</p>
                  </div>
                  {selectedSubmission.preferredDate && (
                    <div>
                      <p className="text-white/60 text-sm mb-1">Preferowany termin</p>
                      <p className="text-white">
                        {new Date(selectedSubmission.preferredDate).toLocaleDateString("pl-PL", { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-white/60 text-sm mb-1">Poziom realizacji</p>
                    <p className="text-white">{selectedSubmission.estimatedLevel}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm mb-1">Data zgłoszenia</p>
                    <p className="text-white">
                      {new Date(selectedSubmission.createdAt).toLocaleString("pl-PL")}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-white/60 text-sm mb-2">Dodatki</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSubmission.extras.popcorn && (
                      <span className="px-3 py-1 bg-brand-gold/20 text-brand-gold rounded-full text-sm">
                        Popcorn
                      </span>
                    )}
                    {selectedSubmission.extras.deckchairs && (
                      <span className="px-3 py-1 bg-brand-gold/20 text-brand-gold rounded-full text-sm">
                        Leżaki
                      </span>
                    )}
                    {selectedSubmission.extras.license && (
                      <span className="px-3 py-1 bg-brand-gold/20 text-brand-gold rounded-full text-sm">
                        Obsługa Licencyjna
                      </span>
                    )}
                    {!selectedSubmission.extras.popcorn &&
                      !selectedSubmission.extras.deckchairs &&
                      !selectedSubmission.extras.license && (
                        <span className="text-white/40 text-sm">Brak dodatków</span>
                      )}
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <p className="text-white/60 text-sm mb-2">Wiadomość od klienta</p>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-white whitespace-pre-wrap">{selectedSubmission.message}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <div className="text-center py-24">
                <Eye className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/60">Wybierz zgłoszenie z listy, aby zobaczyć szczegóły</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

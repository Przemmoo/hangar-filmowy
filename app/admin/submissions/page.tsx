"use client";

import { useState, useEffect } from "react";
import { Mail, Eye, Trash2, Loader2, Search, Filter, Send, MessageSquare } from "lucide-react";

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

interface SubmissionReply {
  id: string;
  submissionId: string;
  subject: string;
  message: string;
  sentBy: string;
  sentByName: string;
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
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyForm, setReplyForm] = useState({ subject: "", message: "" });
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replyMessage, setReplyMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [replyHistory, setReplyHistory] = useState<SubmissionReply[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

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

  const loadReplyHistory = async (submissionId: string) => {
    setIsLoadingHistory(true);
    try {
      const response = await fetch(`/api/admin/submissions/${submissionId}/replies`);
      if (response.ok) {
        const data = await response.json();
        setReplyHistory(data);
      }
    } catch (error) {
      console.error("Error loading reply history:", error);
    } finally {
      setIsLoadingHistory(false);
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

  const openReplyModal = () => {
    if (!selectedSubmission) return;
    
    setReplyForm({
      subject: `Odpowiedź na zapytanie - ${eventTypeLabels[selectedSubmission.eventType] || selectedSubmission.eventType}`,
      message: `Dzień dobry ${selectedSubmission.firstName},\n\nDziękujemy za zainteresowanie naszą ofertą.\n\n\n\nPozdrawiamy,\nZespół Hangar Filmowy`,
    });
    setShowReplyModal(true);
    setReplyMessage(null);
  };

  const closeReplyModal = () => {
    setShowReplyModal(false);
    setReplyForm({ subject: "", message: "" });
    setReplyMessage(null);
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSubmission || !replyForm.subject || !replyForm.message) {
      setReplyMessage({ type: "error", text: "Temat i treść wiadomości są wymagane" });
      return;
    }

    setIsSendingReply(true);
    setReplyMessage(null);

    try {
      const response = await fetch(`/api/admin/submissions/${selectedSubmission.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: replyForm.subject,
          message: replyForm.message,
        }),
      });

      if (response.ok) {
        setReplyMessage({ type: "success", text: "Odpowiedź została wysłana pomyślnie!" });
        // Zmień status na CONTACTED jeśli był NEW
        if (selectedSubmission.status === "NEW") {
          await updateStatus(selectedSubmission.id, "CONTACTED");
        }
        // Odśwież historię odpowiedzi
        await loadReplyHistory(selectedSubmission.id);
        setTimeout(() => {
          closeReplyModal();
        }, 2000);
      } else {
        const error = await response.json();
        setReplyMessage({ type: "error", text: error.error || "Błąd wysyłania odpowiedzi" });
      }
    } catch (error) {
      setReplyMessage({ type: "error", text: "Błąd wysyłania odpowiedzi" });
    } finally {
      setIsSendingReply(false);
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
                    onClick={() => {
                      setSelectedSubmission(submission);
                      loadReplyHistory(submission.id);
                    }}
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
                    onClick={openReplyModal}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-brand-gold to-brand-orange text-brand-dark font-semibold rounded-lg hover:scale-105 transition"
                    title="Wyślij odpowiedź"
                  >
                    <Send className="w-4 h-4" />
                    <span>Odpowiedz</span>
                  </button>
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

              {/* Reply History */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>Historia Odpowiedzi ({replyHistory.length})</span>
                  </h3>
                </div>
                
                {isLoadingHistory ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-6 h-6 text-brand-gold animate-spin mx-auto mb-2" />
                    <p className="text-white/60 text-sm">Ładowanie historii...</p>
                  </div>
                ) : replyHistory.length === 0 ? (
                  <div className="text-center py-8 bg-white/5 rounded-lg">
                    <MessageSquare className="w-12 h-12 text-white/20 mx-auto mb-2" />
                    <p className="text-white/60 text-sm">Brak wysłanych odpowiedzi</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {replyHistory.map((reply) => (
                      <div key={reply.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="text-white font-medium mb-1">{reply.subject}</h4>
                            <div className="flex items-center space-x-3 text-xs text-white/60">
                              <span>Wysłał: {reply.sentByName}</span>
                              <span>•</span>
                              <span>{new Date(reply.createdAt).toLocaleString("pl-PL")}</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 mt-2">
                          <p className="text-white/80 text-sm whitespace-pre-wrap">{reply.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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

      {/* Reply Modal */}
      {showReplyModal && selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-brand-dark border border-white/10 rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-white mb-2">
              Odpowiedź na zgłoszenie
            </h3>
            <p className="text-white/60 mb-6">
              Do: {selectedSubmission.firstName} {selectedSubmission.lastName} ({selectedSubmission.email})
            </p>

            {replyMessage && (
              <div
                className={`mb-4 p-4 rounded-lg ${
                  replyMessage.type === "success"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {replyMessage.text}
              </div>
            )}

            <form onSubmit={handleSendReply} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Temat wiadomości *
                </label>
                <input
                  type="text"
                  value={replyForm.subject}
                  onChange={(e) => setReplyForm({ ...replyForm, subject: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
                  placeholder="Temat emaila"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Treść wiadomości *
                </label>
                <textarea
                  value={replyForm.message}
                  onChange={(e) => setReplyForm({ ...replyForm, message: e.target.value })}
                  required
                  rows={12}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none resize-none"
                  placeholder="Wpisz treść odpowiedzi..."
                />
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-white/60 text-xs mb-2">Szczegóły zgłoszenia:</p>
                <div className="text-white/80 text-sm space-y-1">
                  <p>• Rodzaj: {eventTypeLabels[selectedSubmission.eventType]}</p>
                  <p>• Liczba widzów: {selectedSubmission.audienceSize}</p>
                  {selectedSubmission.preferredDate && (
                    <p>• Termin: {new Date(selectedSubmission.preferredDate).toLocaleDateString("pl-PL")}</p>
                  )}
                  <p>• Kategoria: {selectedSubmission.estimatedLevel}</p>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeReplyModal}
                  disabled={isSendingReply}
                  className="flex-1 px-4 py-3 border border-white/10 text-white rounded-lg hover:bg-white/5 transition disabled:opacity-50"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  disabled={isSendingReply}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-brand-gold to-brand-orange text-brand-dark font-semibold rounded-lg hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center space-x-2"
                >
                  {isSendingReply ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Wysyłanie...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Wyślij Odpowiedź</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

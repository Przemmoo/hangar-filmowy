"use client";

import { useState, useEffect } from "react";
import { Save, Eye, Loader2, Download } from "lucide-react";

interface ContentSection {
  section: string;
  data: any;
}

const sections = [
  { key: "hero", name: "Sekcja Hero", description: "Nagłówek strony głównej" },
  { key: "about", name: "O Nas", description: "Sekcja o firmie" },
  { key: "why-us", name: "Technologia", description: "3 boxy z zaletami" },
  { key: "offer", name: "Oferta", description: "4 karty ofertowe" },
  { key: "for-who", name: "Dla Kogo", description: "4 grupy docelowe" },
  { key: "process", name: "Proces", description: "Timeline 4 kroków" },
  { key: "contact", name: "Kontakt", description: "Nagłówek formularza" },
  { key: "footer", name: "Footer", description: "Stopka strony" },
];

export default function ContentManagement() {
  const [activeSection, setActiveSection] = useState("hero");
  const [content, setContent] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [message, setMessage] = useState<{type: "success" | "error", text: string} | null>(null);

  // Load content on mount
  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/content");
      if (response.ok) {
        const data = await response.json();
        const contentMap: Record<string, any> = {};
        
        // Ensure data is an array
        const items = Array.isArray(data) ? data : [];
        
        items.forEach((item: ContentSection) => {
          contentMap[item.section] = item.data;
        });
        setContent(contentMap);
      }
    } catch (error) {
      console.error("Error loading content:", error);
      showMessage("error", "Błąd wczytywania treści");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMigrate = async () => {
    if (!confirm("Czy na pewno chcesz zaimportować domyślne dane? To nadpisze istniejące treści.")) {
      return;
    }

    setIsMigrating(true);
    try {
      const response = await fetch("/api/admin/migrate-content", {
        method: "POST",
      });

      if (response.ok) {
        showMessage("success", "Dane zostały zmigrowane! Odświeżam...");
        setTimeout(() => {
          loadContent();
        }, 1000);
      } else {
        showMessage("error", "Błąd migracji danych");
      }
    } catch (error) {
      console.error("Error migrating content:", error);
      showMessage("error", "Błąd migracji danych");
    } finally {
      setIsMigrating(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: activeSection,
          data: content[activeSection] || {},
        }),
      });

      if (response.ok) {
        showMessage("success", "Zapisano pomyślnie!");
        await loadContent(); // Reload data from database
      } else {
        showMessage("error", "Błąd zapisu");
      }
    } catch (error) {
      console.error("Error saving content:", error);
      showMessage("error", "Błąd zapisu");
    } finally {
      setIsSaving(false);
    }
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const updateContent = (field: string, value: any) => {
    setContent(prev => ({
      ...prev,
      [activeSection]: {
        ...prev[activeSection],
        [field]: value,
      },
    }));
  };

  const renderHeroEditor = () => {
    const data = content.hero || {};
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Nagłówek H1
          </label>
          <input
            type="text"
            value={data.title || ""}
            onChange={(e) => updateContent("title", e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
            placeholder="Prawdziwe Kino"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Nagłówek H1 - część 2 (gradient)
          </label>
          <input
            type="text"
            value={data.titleGradient || ""}
            onChange={(e) => updateContent("titleGradient", e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
            placeholder="Pod Gwiazdami"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Subtitle
          </label>
          <input
            type="text"
            value={data.subtitle || ""}
            onChange={(e) => updateContent("subtitle", e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
            placeholder="Wynajem profesjonalnego ekranu LED..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Lead text
          </label>
          <textarea
            value={data.lead || ""}
            onChange={(e) => updateContent("lead", e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none resize-none"
            placeholder="Organizacja kin plenerowych..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Tekst przycisku głównego
          </label>
          <input
            type="text"
            value={data.ctaPrimary || ""}
            onChange={(e) => updateContent("ctaPrimary", e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
            placeholder="ZAPYTAJ O TERMIN"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Tekst przycisku drugiego
          </label>
          <input
            type="text"
            value={data.ctaSecondary || ""}
            onChange={(e) => updateContent("ctaSecondary", e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
            placeholder="ZOBACZ OFERTĘ"
          />
        </div>
      </div>
    );
  };

  const renderAboutEditor = () => {
    const data = content.about || {};
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Nagłówek H2
          </label>
          <input
            type="text"
            value={data.title || ""}
            onChange={(e) => updateContent("title", e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Tekst główny
          </label>
          <textarea
            value={data.content || ""}
            onChange={(e) => updateContent("content", e.target.value)}
            rows={8}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            URL zdjęcia
          </label>
          <input
            type="text"
            value={data.imageUrl || ""}
            onChange={(e) => updateContent("imageUrl", e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
            placeholder="/images/about.jpg"
          />
          <p className="mt-2 text-xs text-white/40">
            Dodaj zdjęcie w Bibliotece Mediów i skopiuj URL
          </p>
        </div>
      </div>
    );
  };

  const renderFooterEditor = () => {
    const data = content.footer || {};
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Slogan
          </label>
          <input
            type="text"
            value={data.slogan || ""}
            onChange={(e) => updateContent("slogan", e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Email kontaktowy
          </label>
          <input
            type="email"
            value={data.email || ""}
            onChange={(e) => updateContent("email", e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Telefon
          </label>
          <input
            type="tel"
            value={data.phone || ""}
            onChange={(e) => updateContent("phone", e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Adres
          </label>
          <input
            type="text"
            value={data.address || ""}
            onChange={(e) => updateContent("address", e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
          />
        </div>
      </div>
    );
  };

  const renderWhyUsEditor = () => {
    const data = content["why-us"] || { boxes: [{}, {}, {}] };
    const boxes = Array.isArray(data.boxes) ? data.boxes : [{}, {}, {}];
    
    const updateBox = (index: number, field: string, value: string) => {
      const newBoxes = [...boxes];
      newBoxes[index] = { ...newBoxes[index], [field]: value };
      updateContent("boxes", newBoxes);
    };

    return (
      <div className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Nagłówek sekcji
          </label>
          <input
            type="text"
            value={data.title || ""}
            onChange={(e) => updateContent("title", e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
            placeholder="Dlaczego Ekran LED"
          />
        </div>

        {boxes.map((box: any, index: number) => (
          <div key={index} className="p-6 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">Box {index + 1}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Tytuł
                </label>
                <input
                  type="text"
                  value={box.title || ""}
                  onChange={(e) => updateBox(index, "title", e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
                  placeholder="Obraz Żyleta"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Opis
                </label>
                <textarea
                  value={box.description || ""}
                  onChange={(e) => updateBox(index, "description", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none resize-none"
                  placeholder="Tradycyjna projekcja wymaga..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderOfferEditor = () => {
    const data = content.offer || { cards: [{}, {}, {}, {}] };
    const cards = Array.isArray(data.cards) ? data.cards : [{}, {}, {}, {}];
    
    const updateCard = (index: number, field: string, value: string) => {
      const newCards = [...cards];
      newCards[index] = { ...newCards[index], [field]: value };
      updateContent("cards", newCards);
    };

    return (
      <div className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Nagłówek sekcji
          </label>
          <input
            type="text"
            value={data.title || ""}
            onChange={(e) => updateContent("title", e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
            placeholder="Od licencji po ostatnie ziarno kukurydzy"
          />
        </div>

        {cards.map((card: any, index: number) => (
          <div key={index} className="p-6 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">Karta {index + 1}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Tytuł
                </label>
                <input
                  type="text"
                  value={card.title || ""}
                  onChange={(e) => updateCard(index, "title", e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
                  placeholder="Technika Kinowa"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Opis
                </label>
                <textarea
                  value={card.description || ""}
                  onChange={(e) => updateCard(index, "description", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none resize-none"
                  placeholder="Mobilne ekrany LED..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  URL zdjęcia
                </label>
                <input
                  type="text"
                  value={card.imageUrl || ""}
                  onChange={(e) => updateCard(index, "imageUrl", e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
                  placeholder="/technologia-kinowa.png"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderForWhoEditor = () => {
    const data = content["for-who"] || { cards: [{}, {}, {}, {}] };
    const cards = Array.isArray(data.cards) ? data.cards : [{}, {}, {}, {}];
    
    const updateCard = (index: number, field: string, value: string) => {
      const newCards = [...cards];
      newCards[index] = { ...newCards[index], [field]: value };
      updateContent("cards", newCards);
    };

    return (
      <div className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Nagłówek sekcji
          </label>
          <input
            type="text"
            value={data.title || ""}
            onChange={(e) => updateContent("title", e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
            placeholder="Tworzymy kino tam, gdzie go potrzebujesz"
          />
        </div>

        {cards.map((card: any, index: number) => (
          <div key={index} className="p-6 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">Grupa {index + 1}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Tytuł
                </label>
                <input
                  type="text"
                  value={card.title || ""}
                  onChange={(e) => updateCard(index, "title", e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
                  placeholder="Samorządy i Miasta"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Opis
                </label>
                <textarea
                  value={card.description || ""}
                  onChange={(e) => updateCard(index, "description", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none resize-none"
                  placeholder="Kino w parku..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderProcessEditor = () => {
    const data = content.process || { steps: [{}, {}, {}, {}] };
    const steps = Array.isArray(data.steps) ? data.steps : [{}, {}, {}, {}];
    
    const updateStep = (index: number, field: string, value: string) => {
      const newSteps = [...steps];
      newSteps[index] = { ...newSteps[index], [field]: value };
      updateContent("steps", newSteps);
    };

    return (
      <div className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Nagłówek sekcji
          </label>
          <input
            type="text"
            value={data.title || ""}
            onChange={(e) => updateContent("title", e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
            placeholder="Jak zorganizować kino?"
          />
        </div>

        {steps.map((step: any, index: number) => (
          <div key={index} className="p-6 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">Krok {index + 1}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Tytuł
                </label>
                <input
                  type="text"
                  value={step.title || ""}
                  onChange={(e) => updateStep(index, "title", e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
                  placeholder="Ustalamy Termin & Wizję"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Opis
                </label>
                <textarea
                  value={step.description || ""}
                  onChange={(e) => updateStep(index, "description", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none resize-none"
                  placeholder="Dzwonisz/piszesz..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderContactEditor = () => {
    const data = content.contact || {};
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Nagłówek H2 (część 1)
          </label>
          <input
            type="text"
            value={data.title || ""}
            onChange={(e) => updateContent("title", e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
            placeholder="Zaplanuj"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Nagłówek H2 (część 2 - gradient)
          </label>
          <input
            type="text"
            value={data.titleGradient || ""}
            onChange={(e) => updateContent("titleGradient", e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
            placeholder="Swoje Wydarzenie"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Podtytuł
          </label>
          <textarea
            value={data.subtitle || ""}
            onChange={(e) => updateContent("subtitle", e.target.value)}
            rows={2}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none resize-none"
            placeholder="Odpowiedz na kilka pytań..."
          />
        </div>
      </div>
    );
  };

  const renderEditor = () => {
    switch (activeSection) {
      case "hero":
        return renderHeroEditor();
      case "about":
        return renderAboutEditor();
      case "why-us":
        return renderWhyUsEditor();
      case "offer":
        return renderOfferEditor();
      case "for-who":
        return renderForWhoEditor();
      case "process":
        return renderProcessEditor();
      case "contact":
        return renderContactEditor();
      case "footer":
        return renderFooterEditor();
      default:
        return (
          <div className="text-white/60 text-center py-12">
            <p>Edytor dla tej sekcji będzie dostępny wkrótce</p>
            <p className="text-sm mt-2">Sekcja: {activeSection}</p>
          </div>
        );
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Zarządzanie Treścią</h1>
        <p className="text-white/60">Edytuj treść wszystkich sekcji strony</p>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar - Section selector */}
        <div className="col-span-3">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
            <h3 className="text-sm font-semibold text-white mb-4">Sekcje</h3>
            <div className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    activeSection === section.key
                      ? "bg-brand-gold text-brand-dark font-medium"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="font-medium">{section.name}</div>
                  <div className="text-xs opacity-60">{section.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main editor */}
        <div className="col-span-9">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            {/* Section header */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {sections.find(s => s.key === activeSection)?.name}
                </h2>
                <p className="text-white/60 text-sm">
                  {sections.find(s => s.key === activeSection)?.description}
                </p>
              </div>
              <div className="flex space-x-3">
                {Object.keys(content).length === 0 && !isLoading && (
                  <button
                    onClick={handleMigrate}
                    disabled={isMigrating}
                    className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-lg hover:scale-105 transition disabled:opacity-50"
                  >
                    {isMigrating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    <span>{isMigrating ? "Importowanie..." : "Importuj Dane"}</span>
                  </button>
                )}
                <button
                  onClick={() => window.open("/", "_blank")}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                >
                  <Eye className="w-4 h-4" />
                  <span>Podgląd</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-brand-gold to-brand-orange text-brand-dark font-semibold rounded-lg hover:scale-105 transition disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{isSaving ? "Zapisywanie..." : "Zapisz"}</span>
                </button>
              </div>
            </div>

            {/* Editor content */}
            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 text-brand-gold animate-spin mx-auto mb-4" />
                <p className="text-white/60">Ładowanie treści...</p>
              </div>
            ) : (
              renderEditor()
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { Upload, Image as ImageIcon, Trash2, Loader2, Copy, Check } from "lucide-react";

interface Media {
  id: string;
  filename: string;
  url: string;
  alt?: string;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
  createdAt: string;
}

export default function MediaLibrary() {
  const [media, setMedia] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/media");
      if (response.ok) {
        const data = await response.json();
        setMedia(data);
      }
    } catch (error) {
      console.error("Error loading media:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/admin/media", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          await loadMedia();
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }

    setIsUploading(false);
    e.target.value = "";
  };

  const deleteMedia = async (id: string) => {
    if (!confirm("Czy na pewno chcesz usunąć ten plik?")) return;

    try {
      const response = await fetch(`/api/admin/media/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await loadMedia();
        if (selectedMedia?.id === id) {
          setSelectedMedia(null);
        }
      }
    } catch (error) {
      console.error("Error deleting media:", error);
    }
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Biblioteka Mediów</h1>
          <p className="text-white/60">Zarządzaj zdjęciami i grafikami</p>
        </div>
        <label className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-brand-gold to-brand-orange text-brand-dark font-semibold rounded-lg hover:scale-105 transition cursor-pointer">
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Wgrywanie...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>Dodaj Zdjęcia</span>
            </>
          )}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading}
          />
        </label>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Gallery Grid */}
        <div className="col-span-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            {isLoading ? (
              <div className="text-center py-24">
                <Loader2 className="w-8 h-8 text-brand-gold animate-spin mx-auto mb-4" />
                <p className="text-white/60">Ładowanie mediów...</p>
              </div>
            ) : media.length === 0 ? (
              <div className="text-center py-24">
                <ImageIcon className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/60 mb-4">Brak zdjęć w bibliotece</p>
                <label className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>Dodaj pierwsze zdjęcie</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {media.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedMedia(item)}
                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition group ${
                      selectedMedia?.id === item.id
                        ? "ring-2 ring-brand-gold"
                        : "hover:ring-2 hover:ring-white/30"
                    }`}
                  >
                    <img
                      src={item.url}
                      alt={item.alt || item.filename}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Details Sidebar */}
        <div className="col-span-4">
          {selectedMedia ? (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 sticky top-8">
              {/* Preview */}
              <div className="aspect-square rounded-lg overflow-hidden mb-6">
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.alt || selectedMedia.filename}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-white/60 text-xs mb-1">Nazwa pliku</p>
                  <p className="text-white text-sm font-mono break-all">
                    {selectedMedia.filename}
                  </p>
                </div>

                <div>
                  <p className="text-white/60 text-xs mb-1">URL</p>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={selectedMedia.url}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs font-mono"
                    />
                    <button
                      onClick={() => copyUrl(selectedMedia.url, selectedMedia.id)}
                      className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                      title="Kopiuj URL"
                    >
                      {copiedId === selectedMedia.id ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/60 text-xs mb-1">Rozmiar</p>
                    <p className="text-white text-sm">
                      {formatFileSize(selectedMedia.size)}
                    </p>
                  </div>
                  {selectedMedia.width && selectedMedia.height && (
                    <div>
                      <p className="text-white/60 text-xs mb-1">Wymiary</p>
                      <p className="text-white text-sm">
                        {selectedMedia.width} × {selectedMedia.height}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-white/60 text-xs mb-1">Data dodania</p>
                  <p className="text-white text-sm">
                    {new Date(selectedMedia.createdAt).toLocaleString("pl-PL")}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <button
                onClick={() => deleteMedia(selectedMedia.id)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>Usuń plik</span>
              </button>
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 sticky top-8">
              <div className="text-center py-24">
                <ImageIcon className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/60">Wybierz zdjęcie, aby zobaczyć szczegóły</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

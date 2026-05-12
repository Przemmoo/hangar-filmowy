'use client';

import { useState, useEffect } from 'react';
import { X, Search, Film as FilmIcon } from 'lucide-react';

interface Movie {
  id: string;
  title: string;
  category: string;
  description: string;
  distributor: string;
}

interface MovieCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MovieCatalogModal({ isOpen, onClose }: MovieCatalogModalProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [hoveredMovieId, setHoveredMovieId] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      fetchMovies();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm.length >= 3) {
      const filtered = movies.filter(movie => {
        const searchLower = searchTerm.toLowerCase();
        
        // Parse categories for search
        let categories: string[] = [];
        try {
          categories = JSON.parse(movie.category || '[]');
        } catch {
          categories = movie.category ? [movie.category] : [];
        }
        const categoryText = categories.join(' ').toLowerCase();
        
        return movie.title.toLowerCase().includes(searchLower) ||
          categoryText.includes(searchLower) ||
          movie.distributor.toLowerCase().includes(searchLower);
      });
      setFilteredMovies(filtered);
    } else {
      setFilteredMovies(movies);
    }
  }, [searchTerm, movies]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/movies');
      if (!response.ok) throw new Error('Failed to fetch movies');
      const data = await response.json() as Movie[];
      setMovies(data);
      setFilteredMovies(data);
    } catch (err) {
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseEnter = (movieId: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
    setHoveredMovieId(movieId);
  };

  const handleMouseLeave = () => {
    setHoveredMovieId(null);
  };

  if (!isOpen) return null;

  const hoveredMovie = movies.find(m => m.id === hoveredMovieId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-brand-gold to-yellow-500 rounded-lg">
              <FilmIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Katalog Filmów
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Zamknij"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Wyszukaj film (min. 3 znaki)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent text-sm md:text-base"
            />
          </div>
          {searchTerm.length > 0 && searchTerm.length < 3 && (
            <p className="mt-2 text-sm text-gray-500">
              Wprowadź minimum 3 znaki aby wyszukać
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              <div className="animate-spin w-8 h-8 border-4 border-brand-gold border-t-transparent rounded-full mx-auto mb-4"></div>
              Wczytywanie katalogu...
            </div>
          ) : filteredMovies.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FilmIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">
                {searchTerm.length >= 3 ? 'Nie znaleziono filmów' : 'Brak filmów w katalogu'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMovies.map((movie) => {
                // Parse categories
                let categories: string[] = [];
                try {
                  categories = JSON.parse(movie.category || '[]');
                } catch {
                  categories = movie.category ? [movie.category] : [];
                }
                
                return (
                <div
                  key={movie.id}
                  onMouseEnter={(e) => handleMouseEnter(movie.id, e)}
                  onMouseLeave={handleMouseLeave}
                  className="relative p-4 border border-gray-200 rounded-lg hover:border-brand-gold hover:shadow-lg transition-all cursor-pointer bg-white group"
                >
                  <div className="space-y-2">
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-brand-gold transition-colors">
                      {movie.title}
                    </h3>
                    
                    {categories.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-gray-500">
                          {categories.length === 1 ? 'Kategoria:' : 'Kategorie:'}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {categories.map(cat => (
                            <span key={cat} className="inline-block px-2 py-1 bg-brand-gold/20 text-brand-dark rounded text-xs font-medium whitespace-nowrap">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {movie.distributor && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-500">Dystrybutor:</span>
                        <span className="text-sm text-gray-700">{movie.distributor}</span>
                      </div>
                    )}
                  </div>

                  {movie.description && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-400 italic">
                        Najedź aby zobaczyć opis
                      </p>
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          )}

          <div className="mt-6 text-center text-sm text-gray-500">
            Znaleziono: {filteredMovies.length} {filteredMovies.length === 1 ? 'film' : 'filmów'}
          </div>
        </div>
      </div>

      {hoveredMovie && hoveredMovie.description && (
        <div
          className="fixed z-[60] max-w-sm p-4 bg-brand-dark text-white rounded-lg shadow-2xl pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
          }}
        >
          <div className="font-bold mb-2 text-brand-gold">{hoveredMovie.title}</div>
          <p className="text-sm leading-relaxed">{hoveredMovie.description}</p>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-brand-dark"></div>
        </div>
      )}
    </div>
  );
}

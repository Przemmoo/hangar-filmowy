'use client';

import { useState, useEffect } from 'react';
import { Film, Plus, Pencil, Trash2, Save, X } from 'lucide-react';

interface Movie {
  id: string;
  title: string;
  category: string;
  description: string;
  distributor: string;
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES = [
  'Dramat',
  'Komedia',
  'Akcja',
  'Familijny',
  'Animacja',
  'Przygodowy',
  'Sci-Fi',
  'Horror',
  'Thriller',
  'Romans',
  'Fantasy',
  'Dokumentalny',
  'Muzyczny',
  'Western',
  'Sensacyjny'
];

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    distributor: ''
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/movies');
      if (!response.ok) throw new Error('Failed to fetch movies');
      const data = await response.json() as Movie[];
      setMovies(data);
      setError('');
    } catch (err) {
      setError('Błąd podczas wczytywania filmów');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingMovie(null);
    setFormData({
      title: '',
      category: '',
      description: '',
      distributor: ''
    });
  };

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setIsAddingNew(false);
    setFormData({
      title: movie.title,
      category: movie.category,
      description: movie.description,
      distributor: movie.distributor
    });
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingMovie(null);
    setFormData({
      title: '',
      category: '',
      description: '',
      distributor: ''
    });
  };

  const handleSave = async () => {
    if (!formData.title || !formData.category) {
      alert('Tytuł i kategoria są wymagane');
      return;
    }

    try {
      setLoading(true);

      if (editingMovie) {
        const response = await fetch(`/api/admin/movies/${editingMovie.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Failed to update movie');
      } else {
        const response = await fetch('/api/admin/movies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Failed to create movie');
      }

      await fetchMovies();
      handleCancel();
    } catch (err) {
      setError('Błąd podczas zapisywania filmu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (movieId: string) => {
    if (!confirm('Czy na pewno chcesz usunąć ten film z katalogu?')) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/admin/movies/${movieId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete movie');

      await fetchMovies();
    } catch (err) {
      setError('Błąd podczas usuwania filmu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.distributor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Film className="w-7 h-7 md:w-8 md:h-8 text-brand-gold" />
              Katalog Filmów
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Zarządzaj katalogiem dostępnych filmów
            </p>
          </div>

          <button
            onClick={handleAddNew}
            disabled={loading || isAddingNew}
            className="flex items-center gap-2 px-4 py-2 bg-brand-gold text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            Dodaj Film
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {(isAddingNew || editingMovie) && (
          <div className="mb-6 bg-white rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              {editingMovie ? 'Edytuj Film' : 'Dodaj Nowy Film'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tytuł filmu *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                  placeholder="Np. Incepcja"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategoria *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                >
                  <option value="">Wybierz kategorię</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dystrybutor
                </label>
                <input
                  type="text"
                  value={formData.distributor}
                  onChange={(e) => setFormData({ ...formData, distributor: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                  placeholder="Np. Warner Bros"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Opis
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                  placeholder="Krótki opis filmu..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-brand-gold text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                Zapisz
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-4 h-4" />
                Anuluj
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Szukaj filmu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent"
            />
          </div>

          {loading && !editingMovie && !isAddingNew ? (
            <div className="text-center py-8 text-gray-500">Wczytywanie...</div>
          ) : filteredMovies.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'Nie znaleziono filmów' : 'Brak filmów w katalogu'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="pb-3 px-2 text-sm font-semibold text-gray-700">Tytuł</th>
                    <th className="pb-3 px-2 text-sm font-semibold text-gray-700">Kategoria</th>
                    <th className="pb-3 px-2 text-sm font-semibold text-gray-700 hidden md:table-cell">Dystrybutor</th>
                    <th className="pb-3 px-2 text-sm font-semibold text-gray-700 text-right">Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMovies.map((movie) => (
                    <tr key={movie.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2 text-sm text-gray-900">{movie.title}</td>
                      <td className="py-3 px-2 text-sm">
                        <span className="inline-block px-2 py-1 bg-brand-gold/20 text-brand-dark rounded text-xs font-medium">
                          {movie.category}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-600 hidden md:table-cell">
                        {movie.distributor || '-'}
                      </td>
                      <td className="py-3 px-2 text-sm text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleEdit(movie)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edytuj"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(movie.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
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
            </div>
          )}

          <div className="mt-4 text-sm text-gray-500">
            Razem: {filteredMovies.length} {filteredMovies.length === 1 ? 'film' : 'filmów'}
          </div>
        </div>
      </div>
    </div>
  );
}

import { NextResponse } from 'next/server';
import { dbSelect } from '@/lib/cloudflare-db';

export const runtime = 'edge';

export interface Movie {
  id: string;
  title: string;
  category: string;
  description: string;
  distributor: string;
  createdAt: string;
  updatedAt: string;
}

// GET - Get all movies (public)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let query = 'SELECT * FROM movies';
    const params: string[] = [];

    if (search && search.length >= 3) {
      query += ' WHERE title LIKE ? OR category LIKE ? OR distributor LIKE ?';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY title ASC';

    const movies = await dbSelect(query, params) as Movie[];

    return NextResponse.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movies' },
      { status: 500 }
    );
  }
}

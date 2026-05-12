import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { dbSelect, dbInsert, getCurrentTimestamp } from '@/lib/cloudflare-db';

export const runtime = 'edge';

export interface Movie {
  id: string;
  title: string;
  category: string;
  description: string;
  distributor: string;
  year: number | null;
  createdAt: string;
  updatedAt: string;
}

// GET - Get all movies (admin)
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const movies = await dbSelect(
      'SELECT * FROM movies ORDER BY title ASC',
      []
    ) as Movie[];

    return NextResponse.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movies' },
      { status: 500 }
    );
  }
}

// POST - Create new movie
export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json() as {
      title?: string;
      category?: string;
      description?: string;
      distributor?: string;
      year?: number | null;
    };

    const { title, category, description, distributor, year } = body;

    if (!title || !category) {
      return NextResponse.json(
        { error: 'Title and category are required' },
        { status: 400 }
      );
    }

    const movieId = crypto.randomUUID();
    const timestamp = getCurrentTimestamp();

    await dbInsert(
      'INSERT INTO movies (id, title, category, description, distributor, year, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        movieId,
        title,
        category,
        description || '',
        distributor || '',
        year || null,
        timestamp,
        timestamp
      ]
    );

    return NextResponse.json({ 
      success: true, 
      id: movieId,
      message: 'Movie added successfully' 
    });
  } catch (error) {
    console.error('Error creating movie:', error);
    return NextResponse.json(
      { error: 'Failed to create movie' },
      { status: 500 }
    );
  }
}

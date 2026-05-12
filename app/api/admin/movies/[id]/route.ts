import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { dbUpdate, dbDelete } from '@/lib/cloudflare-db';

export const runtime = 'edge';

type RouteParams = {
  params: Promise<{ id: string }>;
};

// PUT - Update movie
export async function PUT(request: Request, context: RouteParams) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: movieId } = await context.params;
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

    const timestamp = new Date().toISOString();

    await dbUpdate(
      'UPDATE movies SET title = ?, category = ?, description = ?, distributor = ?, year = ?, updatedAt = ? WHERE id = ?',
      [
        title,
        category,
        description || '',
        distributor || '',
        year || null,
        timestamp,
        movieId
      ]
    );

    return NextResponse.json({ 
      success: true,
      message: 'Movie updated successfully' 
    });
  } catch (error) {
    console.error('Error updating movie:', error);
    return NextResponse.json(
      { error: 'Failed to update movie' },
      { status: 500 }
    );
  }
}

// DELETE - Delete movie
export async function DELETE(request: Request, context: RouteParams) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: movieId } = await context.params;

    await dbDelete('DELETE FROM movies WHERE id = ?', [movieId]);

    return NextResponse.json({ 
      success: true,
      message: 'Movie deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting movie:', error);
    return NextResponse.json(
      { error: 'Failed to delete movie' },
      { status: 500 }
    );
  }
}

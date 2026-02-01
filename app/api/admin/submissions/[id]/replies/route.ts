import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { dbSelect } from '@/lib/cloudflare-db';

export const runtime = 'edge';

type RouteParams = {
  params: Promise<{ id: string }>;
};

// GET - Get reply history for submission
export async function GET(request: Request, context: RouteParams) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: submissionId } = await context.params;

    // Get reply history
    const replies = await dbSelect(
      'SELECT * FROM submission_replies WHERE submissionId = ? ORDER BY createdAt DESC',
      [submissionId]
    );

    return NextResponse.json(replies);
  } catch (error) {
    console.error('Error fetching reply history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reply history' },
      { status: 500 }
    );
  }
}

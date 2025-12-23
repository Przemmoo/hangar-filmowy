import { NextResponse } from 'next/server';
import { auth } from '@/auth';

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

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Get reply history
    const response = await fetch(
      `${supabaseUrl}/rest/v1/submission_replies?submissionId=eq.${submissionId}&select=*&order=createdAt.desc`,
      {
        headers: {
          'apikey': supabaseKey!,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch reply history');
    }

    const replies = await response.json();
    return NextResponse.json(replies);
  } catch (error) {
    console.error('Error fetching reply history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reply history' },
      { status: 500 }
    );
  }
}

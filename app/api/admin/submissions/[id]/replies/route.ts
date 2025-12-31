import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabaseAdminFetch } from '@/lib/supabase-admin';

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
    const response = await supabaseAdminFetch(
      `/submission_replies?submissionId=eq.${submissionId}&select=*&order=createdAt.desc`
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

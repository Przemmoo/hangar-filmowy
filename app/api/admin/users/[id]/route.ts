import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { hashPassword } from '@/lib/password';
import { supabaseAdminFetch } from '@/lib/supabase-admin';

export const runtime = 'edge';

type RouteParams = {
  params: Promise<{ id: string }>;
};

// GET - Get single user
export async function GET(request: Request, context: RouteParams) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: userId } = await context.params;
    const currentUserId = session.user.id;
    const userRole = (session.user as any).role;

    // Edytorzy mogą pobierać tylko swoje dane
    if (userRole !== 'admin' && userId !== currentUserId) {
      return NextResponse.json({ error: 'Forbidden - Can only access your own data' }, { status: 403 });
    }

    const response = await supabaseAdminFetch(`/users?id=eq.${userId}&select=id,email,name,role,createdAt`);

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    const users = await response.json();
    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(users[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT - Update user
export async function PUT(request: Request, context: RouteParams) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: userId } = await context.params;
    const body = await request.json();
    const { email, name, password, role } = body;

    const currentUserId = session.user.id;
    const userRole = (session.user as any).role;

    // Edytorzy mogą edytować tylko swoje konto
    if (userRole !== 'admin' && userId !== currentUserId) {
      return NextResponse.json({ error: 'Forbidden - Can only edit your own account' }, { status: 403 });
    }

    // Edytorzy nie mogą zmieniać swojej roli
    if (userRole !== 'admin' && role && role !== userRole) {
      return NextResponse.json({ error: 'Forbidden - Cannot change your own role' }, { status: 403 });
    }

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    // Check if email is already taken by another user
    const checkResponse = await supabaseAdminFetch(
      `/users?email=eq.${email}&id=neq.${userId}&select=id`
    );

    const existingUsers = await checkResponse.json();
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'Email already taken by another user' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {
      email,
      name,
      updatedAt: new Date().toISOString(),
    };

    // Tylko administratorzy mogą zmieniać rolę
    if (userRole === 'admin' && role) {
      updateData.role = role;
    }

    // Only update password if provided
    if (password && password.trim() !== '') {
      updateData.password = await hashPassword(password);
    }

    // Update user
    const response = await supabaseAdminFetch(`/users?id=eq.${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update user: ${errorText}`);
    }

    const updatedUser = await response.json();
    
    // Remove password from response
    if (updatedUser[0]) {
      const { password: _, ...userWithoutPassword } = updatedUser[0];
      return NextResponse.json(userWithoutPassword);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE - Delete user
export async function DELETE(request: Request, context: RouteParams) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: userId } = await context.params;
    const userRole = (session.user as any).role;

    // Tylko administratorzy mogą usuwać konta
    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // Prevent deleting yourself
    if (session.user.id === userId) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Delete user
    const response = await supabaseAdminFetch(`/users?id=eq.${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete user: ${errorText}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { hashPassword } from '@/lib/password';
import { dbSelect, dbInsert, getCurrentTimestamp } from '@/lib/cloudflare-db';

export const runtime = 'edge';

// GET - List all users
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Tylko administratorzy mogą listować wszystkich użytkowników
    const userRole = (session.user as any).role;
    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const users = await dbSelect(
      'SELECT id, email, name, role, createdAt FROM users ORDER BY createdAt DESC'
    );

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST - Create new user
export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Tylko administratorzy mogą tworzyć nowe konta
    const userRole = (session.user as any).role;
    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const body = await request.json() as { email?: string; password?: string; name?: string; role?: string };
    const { email, name, password, role } = body;

    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Email, name, and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUsers = await dbSelect(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);
    const now = getCurrentTimestamp();

    // Create user
    const userId = crypto.randomUUID();
    
    await dbInsert(
      'INSERT INTO users (id, email, name, password, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, email, name, hashedPassword, role || 'admin', now, now]
    );

    // Return created user without password
    return NextResponse.json({
      id: userId,
      email,
      name,
      role: role || 'admin',
      createdAt: now,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

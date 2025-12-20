import { handlers } from "@/auth";

// Use Node.js runtime for Prisma compatibility
export const runtime = 'nodejs';

export const { GET, POST } = handlers;

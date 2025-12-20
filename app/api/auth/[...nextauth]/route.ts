import { handlers } from "@/auth";

// Edge Runtime for Cloudflare Pages
export const runtime = 'edge';

export const { GET, POST } = handlers;

// src/lib/env.ts
import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
});

const envParse = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});

if (!envParse.success) {
  console.error("❌ Invalid environment variables:", envParse.error.format());
  throw new Error("Invalid environment variables");
}

export const env = envParse.data;
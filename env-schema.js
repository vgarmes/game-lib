import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  CLOUDINARY_SECRET: z.string(),
  NEXT_PUBLIC_CLOUDINARY_API_KEY: z.string(),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string(),
  NEXTAUTH_SECRET: z.string(),
});

const _envSchema = envSchema;
export { _envSchema as envSchema };

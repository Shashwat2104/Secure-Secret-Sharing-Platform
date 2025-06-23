import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import bcrypt from "bcryptjs";
import CryptoJS from "crypto-js";
import { checkRateLimit } from "../rateLimit";

const secretSchema = z.object({
  content: z.string().min(1, "Secret content is required"),
  password: z.string().optional(),
  expiresAt: z.date().optional(),
  oneTimeAccess: z.boolean().default(false),
  user_id: z.string().optional(), // Allow user_id from client
});

const viewSecretSchema = z.object({
  secretId: z.string(),
  password: z.string().optional(),
});

export const secretsRouter = router({
  create: publicProcedure
    .input(secretSchema)
    .mutation(async ({ input, ctx }) => {
      const { content, password, expiresAt, oneTimeAccess, user_id } = input;

      // Encrypt the content
      const encryptionKey =
        process.env.ENCRYPTION_KEY || "default-key-change-in-production";
      const encryptedContent = CryptoJS.AES.encrypt(
        content,
        encryptionKey
      ).toString();

      // Hash password if provided
      let passwordHash = null;
      if (password) {
        passwordHash = await bcrypt.hash(password, 12);
      }

      const { data, error } = await ctx.supabase
        .from("secrets")
        .insert({
          content: encryptedContent,
          password_hash: passwordHash,
          expires_at: expiresAt?.toISOString(),
          one_time_access: oneTimeAccess,
          user_id: user_id || null, // Add user_id to insert if provided
        })
        .select()
        .single();

      if (error) {
        console.log("Supabase error (create):", error);
        throw new Error(
          error.message
            ? `Failed to create secret: ${error.message}`
            : `Failed to create secret. Please check your input and try again.`
        );
      }

      return { id: data.id };
    }),

  view: publicProcedure
    .input(viewSecretSchema)
    .mutation(async ({ input, ctx }) => {
      // Rate limiting: key by IP + secretId (or just secretId for demo)
      const ip =
        ctx.req?.headers["x-forwarded-for"] ||
        ctx.req?.socket?.remoteAddress ||
        "unknown";
      const rateKey = `${ip}:${input.secretId}`;
      const rate = checkRateLimit(rateKey);
      if (!rate.allowed) {
        const retrySeconds = rate.retryAfter
          ? Math.ceil(rate.retryAfter / 1000)
          : "a few";
        throw new Error(
          `Too many attempts. Please try again in ${retrySeconds} seconds.`
        );
      }

      const { secretId, password } = input;

      const { data: secret, error } = await ctx.supabase
        .from("secrets")
        .select("*")
        .eq("id", secretId)
        .single();

      if (error || !secret) {
        throw new Error("Secret not found or has been deleted");
      }

      // Check if already viewed and one-time access
      if (secret.viewed && secret.one_time_access) {
        throw new Error(
          "This secret has already been viewed and is no longer available"
        );
      }

      // Check if expired
      if (secret.expires_at && new Date(secret.expires_at) < new Date()) {
        throw new Error("This secret has expired and is no longer available");
      }

      // Check password
      if (secret.password_hash) {
        if (!password) {
          throw new Error(
            "This secret is password protected. Please enter the password."
          );
        }
        const isValidPassword = await bcrypt.compare(
          password,
          secret.password_hash
        );
        if (!isValidPassword) {
          throw new Error("Incorrect password. Please try again.");
        }
      }

      // Mark as viewed if one-time access
      if (secret.one_time_access) {
        await ctx.supabase
          .from("secrets")
          .update({ viewed: true })
          .eq("id", secretId);
      }

      // Decrypt content
      const encryptionKey =
        process.env.ENCRYPTION_KEY || "default-key-change-in-production";
      let decryptedContent: string;

      try {
        decryptedContent = CryptoJS.AES.decrypt(
          secret.content,
          encryptionKey
        ).toString(CryptoJS.enc.Utf8);
        if (!decryptedContent) {
          throw new Error("Failed to decrypt content");
        }
      } catch (decryptError) {
        throw new Error("Failed to decrypt secret content");
      }

      return {
        content: decryptedContent,
        oneTimeAccess: secret.one_time_access,
      };
    }),

  getUserSecrets: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { data, error } = await ctx.supabase
        .from("secrets")
        .select("id, expires_at, one_time_access, viewed, created_at")
        .eq("user_id", input.userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error in getUserSecrets:", error);
        throw new Error(
          `Failed to fetch your secrets: ${error.message || error}`
        );
      }

      return data.map((secret) => ({
        ...secret,
        status:
          secret.viewed && secret.one_time_access
            ? "viewed"
            : secret.expires_at && new Date(secret.expires_at) < new Date()
            ? "expired"
            : "active",
      }));
    }),

  delete: publicProcedure
    .input(z.object({ secretId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { error } = await ctx.supabase
        .from("secrets")
        .delete()
        .eq("id", input.secretId);

      if (error) {
        throw new Error("Failed to delete secret");
      }

      return { success: true };
    }),

  update: publicProcedure
    .input(
      z.object({
        secretId: z.string(),
        content: z.string().min(1, "Secret content is required"),
        password: z.string().optional(),
        expiresAt: z.date().optional().nullable(),
        oneTimeAccess: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { secretId, content, password, expiresAt, oneTimeAccess } = input;
      // Encrypt content
      const encryptionKey =
        process.env.ENCRYPTION_KEY || "default-key-change-in-production";
      const encryptedContent = CryptoJS.AES.encrypt(
        content,
        encryptionKey
      ).toString();
      // Hash password if provided
      let passwordHash = null;
      if (password) {
        passwordHash = await bcrypt.hash(password, 12);
      }
      const { error } = await ctx.supabase
        .from("secrets")
        .update({
          content: encryptedContent,
          password_hash: passwordHash,
          expires_at: expiresAt ? expiresAt.toISOString() : null,
          one_time_access: oneTimeAccess,
        })
        .eq("id", secretId);
      if (error) {
        throw new Error("Failed to update secret");
      }
      return { success: true };
    }),
});

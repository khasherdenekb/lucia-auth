import { z } from "zod";

export const signUpSchema = z
  .object({
    username: z.string().min(2).max(50),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(20),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(20),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  username: z.string().min(2).max(50),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(20),
});

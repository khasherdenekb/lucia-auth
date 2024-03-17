"use server";

import { lucia, validateRequest } from "@/lib/auth";
import db from "@/lib/db";
import { userTable } from "@/lib/db/schema";
import { signInSchema, signUpSchema } from "@/types";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import { cookies } from "next/headers";
import { Argon2id } from "oslo/password";
import { z } from "zod";

export const signUp = async (values: z.infer<typeof signUpSchema>) => {
  const hashedPassword = await new Argon2id().hash(values.password);
  const userId = generateId(15);

  try {
    await db
      .insert(userTable)
      .values({
        id: userId,
        hashedPassword: hashedPassword,
        username: values.username,
      })
      .returning({
        id: userTable.id,
        username: userTable.username,
      });

    const session = await lucia.createSession(userId, {
      expiresIn: 60 * 60 * 24 * 30,
    });

    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return {
      success: true,
      data: "Account created successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      data: error?.message,
    };
  }
};

export const signIn = async (values: z.infer<typeof signInSchema>) => {
  try {
    const existingUser = await db.query.userTable.findFirst({
      where: (table) => eq(table.username, values.username),
    });

    if (!existingUser) {
      return {
        success: false,
        data: "Invalid credentials",
      };
    }

    const isValidPassword = await new Argon2id().verify(
      existingUser.hashedPassword!,
      values.password
    );

    if (!isValidPassword) {
      return {
        success: false,
        data: "Incorrect username or password",
      };
    }

    const session = await lucia.createSession(existingUser.id, {
      expiresIn: 60 * 60 * 24 * 30,
    });

    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return {
      success: true,
      data: "Signed in successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      data: error?.message,
    };
  }
};

export const signOut = async () => {
  try {
    const { session } = await validateRequest();

    if (!session) {
      return {
        success: false,
        data: "Unauthorized",
      };
    }

    await lucia.invalidateSession(session.id);
    const sessionCookie = lucia.createBlankSessionCookie();

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return {
      success: true,
      data: "Signed out successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      data: error?.message,
    };
  }
};

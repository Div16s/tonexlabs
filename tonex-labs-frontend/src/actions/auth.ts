"use server";

import bcrypt from "bcryptjs";
import { signUpSchema } from "~/schemas/auth";
import type { SignUpFormValues } from "~/schemas/auth";
import { db } from "~/server/db";
import { ZodError } from "zod";

export async function signUp(data: SignUpFormValues) {
  try {
    const validatedData = await signUpSchema.parseAsync(data);
    const existingUser = await db.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return { error: "User with this email already exists." };
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    const newUser = await db.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
      },
    });

    return {
      success: true,
      message: "Account created successfully",
    };
  } catch (error: unknown) {
    // if(error?.name === "ZodError" && Array.isArray(error.errors) && error.errors.length > 0){
    //     return { error: error.errors[0].message }
    // }
    // return { error: "Something went wrong. Please try again." }
    
    if (error instanceof ZodError) {
      // Now TypeScript knows 'error' is a ZodError and you can safely access its properties.
      return { error: error?.errors[0]?.message };
    }

    // Generic fallback for all other error types
    return { error: "Something went wrong. Please try again." };
  }
}

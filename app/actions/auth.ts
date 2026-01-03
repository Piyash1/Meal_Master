"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please provide both email and password." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}

import { auth } from "@/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function changePassword(prevState: any, formData: FormData) {
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "All fields are required." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "New passwords do not match." };
  }

  if (newPassword.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized." };
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return { error: "User not found." };
  }

  // Verify current password
  const isPasswordValid = await bcrypt.compare(
    currentPassword,
    user.password || ""
  );

  if (!isPasswordValid) {
    return { error: "Incorrect current password." };
  }

  // Hash new password and update
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await db.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  revalidatePath("/");
  return { success: "Password updated successfully." };
}

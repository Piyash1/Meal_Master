"use server";

import { db } from "../../lib/db";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth-utils";

export async function getMembers() {
  return await db.member.findMany({
    orderBy: { name: "asc" },
  });
}

export async function addMember(name: string) {
  try {
    if (!(await isAdmin())) {
      throw new Error("Unauthorized: Only admins can add members.");
    }
    await db.member.create({
      data: { name },
    });
    revalidatePath("/members");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleMemberStatus(id: string, isActive: boolean) {
  try {
    if (!(await isAdmin())) {
      throw new Error("Unauthorized: Only admins can toggle member status.");
    }
    await db.member.update({
      where: { id },
      data: { isActive },
    });
    revalidatePath("/members");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

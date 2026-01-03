"use server";

import { DepositService } from "../../lib/services/deposit.service";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth-utils";

export async function addDeposit(memberId: string, amount: number, date: Date) {
  try {
    if (!(await isAdmin())) {
      throw new Error("Unauthorized: Only admins can record deposits.");
    }
    await DepositService.addDeposit(memberId, amount, date);
    revalidatePath("/deposits");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getMonthlyDeposits(monthYear: string) {
  return await DepositService.getMonthlyDeposits(monthYear);
}

"use server";

import { CalculationService } from "../../lib/services/calculation.service";
import { revalidatePath } from "next/cache";

export async function calculateMonth(monthYear: string) {
  try {
    await CalculationService.calculateMonth(monthYear);
    revalidatePath("/report");
    revalidatePath("/");
    revalidatePath("/meals");
    revalidatePath("/expenses");
    revalidatePath("/deposits");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getMonthSummary(monthYear: string) {
  return await CalculationService.getMonthSummary(monthYear);
}

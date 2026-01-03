"use server";

import { MealService } from "../../lib/services/meal.service";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth-utils";

export async function updateMeal(memberId: string, date: Date, count: number) {
  try {
    if (!(await isAdmin())) {
      throw new Error("Unauthorized: Only admins can update meals.");
    }
    await MealService.updateMeal(memberId, date, count);
    revalidatePath("/meals");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getMealsByDate(date: Date) {
  return await MealService.getMealsByDate(date);
}

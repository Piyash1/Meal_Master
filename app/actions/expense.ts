"use server";

import { ExpenseService } from "../../lib/services/expense.service";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth-utils";

export async function addExpense(title: string, amount: number, date: Date) {
  try {
    if (!(await isAdmin())) {
      throw new Error("Unauthorized: Only admins can record expenses.");
    }
    await ExpenseService.addExpense(title, amount, date);
    revalidatePath("/expenses");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteExpense(id: string) {
  try {
    if (!(await isAdmin())) {
      throw new Error("Unauthorized: Only admins can delete expenses.");
    }
    await ExpenseService.deleteExpense(id);
    revalidatePath("/expenses");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getMonthlyExpenses(monthYear: string) {
  return await ExpenseService.getMonthlyExpenses(monthYear);
}

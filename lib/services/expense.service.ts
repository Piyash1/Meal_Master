import { db } from "../db";
import { format } from "date-fns";

export class ExpenseService {
  static async addExpense(title: string, amount: number, date: Date) {
    const monthYear = format(date, "yyyy-MM");

    const month = await db.month.findUnique({
      where: { monthYear },
    });

    if (month?.isLocked) {
      throw new Error("Cannot add expenses to a locked month.");
    }

    return await db.expense.create({
      data: { title, amount, date },
    });
  }

  static async getMonthlyExpenses(monthYear: string) {
    const [year, month] = monthYear.split("-").map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return await db.expense.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: "desc" },
    });
  }

  static async getTotalMonthlyExpense(monthYear: string) {
    const [year, month] = monthYear.split("-").map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const result = await db.expense.aggregate({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    return result._sum.amount || 0;
  }

  static async deleteExpense(id: string) {
    const expense = await db.expense.findUnique({ where: { id } });
    if (!expense) throw new Error("Expense not found");

    const monthYear = format(expense.date, "yyyy-MM");
    const month = await db.month.findUnique({ where: { monthYear } });

    if (month?.isLocked) {
      throw new Error("Cannot delete expenses from a locked month.");
    }

    return await db.expense.delete({ where: { id } });
  }
}

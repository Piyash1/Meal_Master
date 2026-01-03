import { db } from "../db";
import { format } from "date-fns";

export class MealService {
  static async getMealsByDate(date: Date) {
    const formattedDate = new Date(date.setHours(0, 0, 0, 0));
    return await db.meal.findMany({
      where: { date: formattedDate },
    });
  }

  static async updateMeal(memberId: string, date: Date, count: number) {
    const monthYear = format(date, "yyyy-MM");

    // Check if month is locked
    const month = await db.month.findUnique({
      where: { monthYear },
    });

    if (month?.isLocked) {
      throw new Error("Cannot edit meals for a locked month.");
    }

    const formattedDate = new Date(date.setHours(0, 0, 0, 0));

    return await db.meal.upsert({
      where: {
        memberId_date: {
          memberId,
          date: formattedDate,
        },
      },
      update: { count },
      create: {
        memberId,
        date: formattedDate,
        count,
      },
    });
  }

  static async getMonthlyTotalMeals(monthYear: string) {
    const [year, month] = monthYear.split("-").map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const result = await db.meal.aggregate({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        count: true,
      },
    });

    return result._sum.count || 0;
  }
}

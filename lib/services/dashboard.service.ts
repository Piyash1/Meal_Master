import { db } from "../db";
import { MealService } from "./meal.service";
import { ExpenseService } from "./expense.service";
import { DepositService } from "./deposit.service";
import { format } from "date-fns";

export class DashboardService {
  static async getMonthlyStats(monthYear: string) {
    const totalMeals = await MealService.getMonthlyTotalMeals(monthYear);
    const totalCost = await ExpenseService.getTotalMonthlyExpense(monthYear);
    const totalDeposit = await this.getTotalMonthlyDeposit(monthYear);
    const mealRate = totalMeals > 0 ? totalCost / totalMeals : 0;

    return {
      totalMeals,
      totalCost,
      totalDeposit,
      mealRate,
    };
  }

  static async getMemberDashboardData(monthYear: string) {
    const members = await db.member.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });

    const [year, monthVal] = monthYear.split("-").map(Number);
    const startDate = new Date(year, monthVal - 1, 1);
    const endDate = new Date(year, monthVal, 0);

    const memberData = await Promise.all(
      members.map(async (member) => {
        const mealCountResult = await db.meal.aggregate({
          where: {
            memberId: member.id,
            date: { gte: startDate, lte: endDate },
          },
          _sum: { count: true },
        });

        const depositAmount = await DepositService.getMemberMonthlyDeposit(
          member.id,
          monthYear
        );

        return {
          id: member.id,
          name: member.name,
          mealCount: mealCountResult._sum.count || 0,
          depositAmount,
        };
      })
    );

    return memberData;
  }

  private static async getTotalMonthlyDeposit(monthYear: string) {
    const [year, month] = monthYear.split("-").map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const result = await db.deposit.aggregate({
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
}

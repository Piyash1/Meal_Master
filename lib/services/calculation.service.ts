import { db } from "../db";
import { MealService } from "./meal.service";
import { ExpenseService } from "./expense.service";
import { DepositService } from "./deposit.service";

export class CalculationService {
  static async calculateMonth(monthYear: string) {
    // 1. Get or create the Month record
    let month = await db.month.findUnique({
      where: { monthYear },
    });

    if (month?.isLocked) {
      throw new Error("Month is already locked.");
    }

    if (!month) {
      month = await db.month.create({
        data: { monthYear, isLocked: false },
      });
    }

    // 2. Fetch all necessary data
    const totalMeals = await MealService.getMonthlyTotalMeals(monthYear);
    const totalCost = await ExpenseService.getTotalMonthlyExpense(monthYear);

    if (totalMeals === 0) {
      throw new Error("Total meals cannot be zero for calculation.");
    }

    const mealRate = totalCost / totalMeals;

    // 3. Calculate per-member totals
    const members = await db.member.findMany({
      where: { isActive: true },
    });

    const summaries = [];

    for (const member of members) {
      const [year, monthVal] = monthYear.split("-").map(Number);
      const startDate = new Date(year, monthVal - 1, 1);
      const endDate = new Date(year, monthVal, 0);

      // Get member's total meals for this month
      const memberMealsResult = await db.meal.aggregate({
        where: {
          memberId: member.id,
          date: { gte: startDate, lte: endDate },
        },
        _sum: { count: true },
      });
      const memberMeals = memberMealsResult._sum.count || 0;

      // Get member's total deposits for this month
      const memberDeposit = await DepositService.getMemberMonthlyDeposit(
        member.id,
        monthYear
      );

      const memberCost = memberMeals * mealRate;
      const balance = memberDeposit - memberCost;

      summaries.push({
        memberId: member.id,
        monthId: month.id,
        totalMeals: memberMeals,
        totalDeposit: memberDeposit,
        totalCost: memberCost,
        balance: balance,
      });
    }

    // 4. Save results in a transaction
    await db.$transaction([
      ...summaries.map((s) =>
        db.monthSummary.upsert({
          where: {
            memberId_monthId: {
              memberId: s.memberId,
              monthId: s.monthId,
            },
          },
          create: s,
          update: s,
        })
      ),
      db.month.update({
        where: { id: month.id },
        data: { isLocked: true },
      }),
    ]);

    return { totalMeals, totalCost, mealRate, summaries };
  }

  static async getMonthSummary(monthYear: string) {
    const month = await db.month.findUnique({
      where: { monthYear },
      include: {
        summaries: {
          include: { member: true },
        },
      },
    });

    return month;
  }
}

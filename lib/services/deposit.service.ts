import { db } from "../db";
import { format } from "date-fns";

export class DepositService {
  static async addDeposit(memberId: string, amount: number, date: Date) {
    const monthYear = format(date, "yyyy-MM");

    const month = await db.month.findUnique({
      where: { monthYear },
    });

    if (month?.isLocked) {
      throw new Error("Cannot add deposits to a locked month.");
    }

    return await db.deposit.create({
      data: { memberId, amount, date },
    });
  }

  static async getMonthlyDeposits(monthYear: string) {
    const [year, month] = monthYear.split("-").map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return await db.deposit.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { member: true },
      orderBy: { date: "desc" },
    });
  }

  static async getMemberMonthlyDeposit(memberId: string, monthYear: string) {
    const [year, month] = monthYear.split("-").map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const result = await db.deposit.aggregate({
      where: {
        memberId,
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

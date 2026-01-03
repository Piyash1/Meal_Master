"use server";

import { DashboardService } from "../../lib/services/dashboard.service";

export async function getDashboardData(monthYear: string) {
  try {
    const stats = await DashboardService.getMonthlyStats(monthYear);
    const members = await DashboardService.getMemberDashboardData(monthYear);

    return {
      stats,
      members,
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

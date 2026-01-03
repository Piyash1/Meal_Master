import { getDashboardData } from "@/app/actions/dashboard";
import { format } from "date-fns";
import {
  Wallet,
  CreditCard,
  Utensils,
  TrendingUp,
  Users,
  Calendar,
} from "lucide-react";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const params = await searchParams;
  const currentMonthYear = params.month || format(new Date(), "yyyy-MM");
  const response = await getDashboardData(currentMonthYear);

  if (!response.success) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-rose-500">
            Error loading dashboard
          </h2>
          <p className="text-slate-400">{response.error}</p>
        </div>
      </div>
    );
  }

  const { stats, members } = response;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Overview
          </h1>
          <p className="text-slate-400 mt-1">
            Real-time status for{" "}
            {format(new Date(currentMonthYear + "-01"), "MMMM yyyy")}
          </p>
        </div>

        <form className="flex items-center gap-3 bg-slate-900/50 p-1.5 rounded-xl border border-slate-800 shadow-xl backdrop-blur-md">
          <Calendar className="w-5 h-5 text-indigo-400 ml-3" />
          <input
            type="month"
            name="month"
            defaultValue={currentMonthYear}
            className="bg-transparent border-none text-slate-200 focus:ring-0 text-sm font-medium w-40"
          />
          <button className="btn btn-primary px-6 rounded-lg font-semibold">
            View
          </button>
        </form>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Deposit"
          value={`$${stats?.totalDeposit.toFixed(2)}`}
          icon={Wallet}
          color="indigo"
          trend="+12%" // Placeholder trend
        />
        <StatCard
          title="Total Cost"
          value={`$${stats?.totalCost.toFixed(2)}`}
          icon={CreditCard}
          color="rose"
        />
        <StatCard
          title="Total Meals"
          value={stats?.totalMeals.toString() || "0"}
          icon={Utensils}
          color="emerald"
        />
        <StatCard
          title="Meal Rate"
          value={`$${stats?.mealRate.toFixed(3)}`}
          icon={TrendingUp}
          color="amber"
          highlight
        />
      </div>

      {/* Member Table */}
      <div className="card border-slate-800/60 overflow-hidden shadow-2xl relative group">
        <div className="absolute inset-0 bg-linear-to-b from-indigo-500/5 to-transparent pointer-events-none" />
        <div className="p-6 border-b border-slate-800/60 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
              <Users className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold">Member Summary</h2>
          </div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">
            {members?.length} Active Members
          </span>
        </div>

        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/40">
                <th className="px-6 py-4 font-semibold text-slate-400 text-sm">
                  Member
                </th>
                <th className="px-6 py-4 font-semibold text-slate-400 text-sm">
                  Deposit
                </th>
                <th className="px-6 py-4 font-semibold text-slate-400 text-sm">
                  Meals
                </th>
                <th className="px-6 py-4 font-semibold text-slate-400 text-sm text-right">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {members?.map((member, idx) => (
                <tr
                  key={member.id}
                  className="hover:bg-slate-800/30 transition-all duration-300 group/row"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-sm font-bold shadow-lg shadow-indigo-500/20 group-hover/row:scale-110 transition-transform">
                        {member.name[0]}
                      </div>
                      <span className="font-semibold text-slate-200">
                        {member.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-slate-100 font-bold">
                        ${member.depositAmount.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase">
                        Current Month
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/50 border border-slate-800 text-sm font-medium">
                      <Utensils className="w-3.5 h-3.5 text-indigo-400" />
                      {member.mealCount}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                      Active
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  trend,
  highlight,
}: {
  title: string;
  value: string;
  icon: any;
  color: "indigo" | "rose" | "emerald" | "amber";
  trend?: string;
  highlight?: boolean;
}) {
  const colorMap = {
    indigo:
      "from-indigo-500/20 to-indigo-500/5 border-indigo-500/20 text-indigo-400",
    rose: "from-rose-500/20 to-rose-500/5 border-rose-500/20 text-rose-400",
    emerald:
      "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400",
    amber:
      "from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-400",
  };

  return (
    <div
      className={`group relative card p-6 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-${color}-500/10 hover:-translate-y-1 ${
        highlight
          ? "ring-2 ring-indigo-500/20 shadow-indigo-500/5 shadow-xl"
          : ""
      }`}
    >
      <div
        className={`absolute inset-0 bg-linear-to-br ${colorMap[color]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`p-2.5 rounded-xl bg-slate-950/50 border border-slate-800 group-hover:border-${color}-500/30 transition-colors`}
          >
            <Icon className={`w-6 h-6 ${colorMap[color].split(" ").pop()}`} />
          </div>
          {trend && (
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full ring-1 ring-emerald-500/20">
              {trend}
            </span>
          )}
        </div>

        <p className="text-slate-400 text-sm font-medium mb-1 group-hover:text-slate-300 transition-colors">
          {title}
        </p>
        <p className="text-3xl font-black text-white tracking-tight">{value}</p>
      </div>
    </div>
  );
}

import { getMonthSummary, calculateMonth } from "@/app/actions/report";
import { format } from "date-fns";
import {
  FileText,
  Calculator,
  Lock,
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from "lucide-react";

type MemberSummary = {
  id: string;
  totalMeals: number;
  totalDeposit: number;
  totalCost: number;
  balance: number;
  member: { id: string; name: string };
};

export default async function ReportPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const params = await searchParams;
  const currentMonthYear = params.month || format(new Date(), "yyyy-MM");
  const summary = await getMonthSummary(currentMonthYear);

  const isLocked = summary?.isLocked || false;
  const totalMeals =
    (summary?.summaries as MemberSummary[] | undefined)?.reduce(
      (sum: number, s: MemberSummary) => sum + s.totalMeals,
      0
    ) || 0;
  const totalCost =
    (summary?.summaries as MemberSummary[] | undefined)?.reduce(
      (sum: number, s: MemberSummary) => sum + s.totalCost,
      0
    ) || 0;
  const mealRate = totalMeals > 0 ? totalCost / totalMeals : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Monthly Report</h1>
          <p className="text-slate-400">
            Finalize calculations and lock the monthly period.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <form className="flex gap-2">
            <input
              type="month"
              name="month"
              defaultValue={currentMonthYear}
              className="input w-44"
            />
            <button className="btn btn-outline">View</button>
          </form>

          {!isLocked && (
            <form
              action={async () => {
                "use server";
                await calculateMonth(currentMonthYear);
              }}
            >
              <button className="btn btn-primary gap-2 bg-indigo-600 hover:bg-indigo-700">
                <Calculator className="w-4 h-4" />
                Calculate & Lock
              </button>
            </form>
          )}
        </div>
      </div>

      {!summary && (
        <div className="card p-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center text-slate-500 mb-2">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-300">
            No calculation data for this month
          </h3>
          <p className="text-slate-400 max-w-sm">
            Click the &quot;Calculate &amp; Lock&quot; button above to process
            all data and generate the final report for {currentMonthYear}.
          </p>
          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg flex gap-3 text-left max-w-md">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-200/80">
              <strong>Warning:</strong> Locking a month will prevent any further
              edits to meals, expenses, or deposits for this period.
            </p>
          </div>
        </div>
      )}

      {summary && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ReportStat title="Total Meals" value={totalMeals.toString()} />
            <ReportStat title="Total Cost" value={`$${totalCost.toFixed(2)}`} />
            <ReportStat
              title="Meal Rate"
              value={`$${mealRate.toFixed(4)}`}
              highlight
            />
          </div>

          <div className="card overflow-hidden">
            <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                Final Balance Sheet
              </h2>
              {isLocked && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-500 px-2 py-1 rounded bg-rose-500/10 border border-rose-500/10">
                  <Lock className="w-3 h-3" /> FINALIZED
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/30">
                    <th className="px-6 py-4 font-semibold text-slate-400">
                      Member Name
                    </th>
                    <th className="px-6 py-4 font-semibold text-slate-400">
                      Meals
                    </th>
                    <th className="px-6 py-4 font-semibold text-slate-400">
                      Deposit
                    </th>
                    <th className="px-6 py-4 font-semibold text-slate-400">
                      Cost
                    </th>
                    <th className="px-6 py-4 font-semibold text-slate-400 text-right">
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {(summary.summaries as MemberSummary[]).map(
                    (s: MemberSummary) => (
                      <tr
                        key={s.id}
                        className="hover:bg-slate-900/40 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-indigo-400">
                            {s.member.name[0]}
                          </div>
                          {s.member.name}
                        </td>
                        <td className="px-6 py-4 text-slate-300 font-medium">
                          {s.totalMeals}
                        </td>
                        <td className="px-6 py-4 text-slate-300">
                          ${s.totalDeposit.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          ${s.totalCost.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div
                            className={`inline-flex items-center gap-1.5 font-bold px-3 py-1 rounded-full text-sm ${
                              s.balance >= 0
                                ? "bg-emerald-500/10 text-emerald-500"
                                : "bg-rose-500/10 text-rose-500"
                            }`}
                          >
                            {s.balance >= 0 ? (
                              <TrendingUp className="w-3.5 h-3.5" />
                            ) : (
                              <TrendingDown className="w-3.5 h-3.5" />
                            )}
                            {s.balance >= 0 ? "+" : ""}
                            {s.balance.toFixed(2)}
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReportStat({
  title,
  value,
  highlight,
}: {
  title: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`card p-6 ${
        highlight ? "border-l-4 border-l-indigo-500" : ""
      }`}
    >
      <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
        {title}
      </p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

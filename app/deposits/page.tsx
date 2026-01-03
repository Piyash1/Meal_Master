import { getMonthlyDeposits, addDeposit } from "@/app/actions/deposit";
import { getMembers } from "@/app/actions/member";
import { format } from "date-fns";
import { Wallet, PlusCircle, User, Calendar } from "lucide-react";
import { isAdmin } from "@/lib/auth-utils";

export default async function DepositsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const params = await searchParams;
  const currentMonthYear = params.month || format(new Date(), "yyyy-MM");
  const deposits = await getMonthlyDeposits(currentMonthYear);
  const members = await getMembers();
  const total = deposits.reduce((sum, d) => sum + d.amount, 0);
  const admin = await isAdmin();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deposits</h1>
          <p className="text-slate-400">
            {admin
              ? "Manage member deposits and tracking."
              : "View member deposits and tracking."}
          </p>
        </div>
        {admin && (
          <AddDepositForm members={members.filter((m) => m.isActive)} />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="card overflow-hidden">
            <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-400" />
                Deposit History
              </h2>
              <div className="text-sm font-medium text-slate-400">
                Month: {currentMonthYear}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/30">
                    <th className="px-6 py-4 font-semibold text-slate-400">
                      Date
                    </th>
                    <th className="px-6 py-4 font-semibold text-slate-400">
                      Member
                    </th>
                    <th className="px-6 py-4 font-semibold text-slate-400">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {deposits.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-10 text-center text-slate-500"
                      >
                        No deposits recorded for this month.
                      </td>
                    </tr>
                  ) : (
                    deposits.map((deposit) => (
                      <tr
                        key={deposit.id}
                        className="hover:bg-slate-900/40 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-slate-400">
                          {format(deposit.date, "MMM dd, yyyy")}
                        </td>
                        <td className="px-6 py-4 font-medium flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-indigo-400 font-bold">
                            {deposit.member.name[0]}
                          </div>
                          {deposit.member.name}
                        </td>
                        <td className="px-6 py-4 text-emerald-400 font-bold">
                          ${deposit.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6 border-t-4 border-t-emerald-500">
            <p className="text-slate-400 text-sm font-medium mb-1">
              Total Pool
            </p>
            <h2 className="text-4xl font-black text-emerald-500">
              ${total.toFixed(2)}
            </h2>
          </div>

          <div className="card p-6 space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              View Different Month
            </h3>
            <form className="flex gap-2">
              <input
                type="month"
                name="month"
                defaultValue={currentMonthYear}
                className="input flex-1"
              />
              <button className="btn btn-outline">Go</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddDepositForm({ members }: { members: any[] }) {
  return (
    <div className="card p-4 bg-slate-900/30">
      <form
        action={async (formData: FormData) => {
          "use server";
          const memberId = formData.get("memberId") as string;
          const amount = parseFloat(formData.get("amount") as string);
          const date = new Date(formData.get("date") as string);
          if (memberId && amount) await addDeposit(memberId, amount, date);
        }}
        className="flex flex-col md:flex-row items-end gap-4"
      >
        <div className="space-y-2 flex-1 w-full">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
            Member
          </label>
          <select name="memberId" className="input" required>
            <option value="">Select Member...</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2 w-full md:w-32">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
            Amount
          </label>
          <input
            name="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            className="input"
            required
          />
        </div>
        <div className="space-y-2 w-full md:w-44">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
            Date
          </label>
          <input
            name="date"
            type="date"
            defaultValue={format(new Date(), "yyyy-MM-dd")}
            className="input"
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary gap-2 h-10 w-full md:w-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Add Deposit
        </button>
      </form>
    </div>
  );
}

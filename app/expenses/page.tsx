import {
  getMonthlyExpenses,
  addExpense,
  deleteExpense,
} from "@/app/actions/expense";
import { format } from "date-fns";
import { Trash2, PlusCircle, CreditCard, Calendar } from "lucide-react";
import { isAdmin } from "@/lib/auth-utils";

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const params = await searchParams;
  const currentMonthYear = params.month || format(new Date(), "yyyy-MM");
  const expenses = await getMonthlyExpenses(currentMonthYear);
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const admin = await isAdmin();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
          <p className="text-slate-400">
            {admin
              ? "Track and manage shared apartment expenses."
              : "View shared apartment expenses."}
          </p>
        </div>
        {admin && <AddExpenseForm />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="card overflow-hidden">
            <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-rose-400" />
                History for {currentMonthYear}
              </h2>
              <div className="text-sm font-medium text-slate-400">
                Count: {expenses.length}
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
                      Title
                    </th>
                    <th className="px-6 py-4 font-semibold text-slate-400">
                      Amount
                    </th>
                    {admin && (
                      <th className="px-6 py-4 font-semibold text-slate-400 text-right">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {expenses.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-10 text-center text-slate-500"
                      >
                        No expenses recorded for this month.
                      </td>
                    </tr>
                  ) : (
                    expenses.map((expense) => (
                      <tr
                        key={expense.id}
                        className="hover:bg-slate-900/40 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-slate-400">
                          {format(expense.date, "MMM dd, yyyy")}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {expense.title}
                        </td>
                        <td className="px-6 py-4 text-rose-400 font-bold">
                          ${expense.amount.toFixed(2)}
                        </td>
                        {admin && (
                          <td className="px-6 py-4 text-right">
                            <form
                              action={async () => {
                                "use server";
                                await deleteExpense(expense.id);
                              }}
                            >
                              <button className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </form>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6 border-t-4 border-t-rose-500">
            <p className="text-slate-400 text-sm font-medium mb-1">
              Monthly Total
            </p>
            <h2 className="text-4xl font-black text-rose-500">
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

function AddExpenseForm() {
  return (
    <div className="card p-4 bg-slate-900/30">
      <form
        action={async (formData: FormData) => {
          "use server";
          const title = formData.get("title") as string;
          const amount = parseFloat(formData.get("amount") as string);
          const date = new Date(formData.get("date") as string);
          if (title && amount) await addExpense(title, amount, date);
        }}
        className="flex flex-col md:flex-row items-end gap-4"
      >
        <div className="space-y-2 flex-1 w-full">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
            Expense Title
          </label>
          <input
            name="title"
            placeholder="Grocery, Oil, etc."
            className="input"
            required
          />
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
          Add Expense
        </button>
      </form>
    </div>
  );
}

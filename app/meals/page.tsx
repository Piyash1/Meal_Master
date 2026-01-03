import { getMembers } from "../actions/member";
import { getMealsByDate } from "../actions/meal";
import { getMonthSummary } from "../actions/report";
import { format } from "date-fns";
import { MealEntryGrid } from "../../components/MealEntryGrid";
import { isAdmin } from "@/lib/auth-utils";

type Member = {
  id: string;
  name: string;
  isActive: boolean;
};

export default async function MealsPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const params = await searchParams;
  const selectedDate = params.date ? new Date(params.date) : new Date();
  const formattedDate = format(selectedDate, "yyyy-MM-dd");
  const monthYear = format(selectedDate, "yyyy-MM");

  const members = await getMembers();
  const meals = await getMealsByDate(selectedDate);
  const summary = await getMonthSummary(monthYear);
  const isLocked = summary?.isLocked || false;
  const admin = await isAdmin();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Meal Entry</h1>
        <p className="text-slate-400">
          {admin
            ? "Record daily meal counts (0-2) for each member."
            : "View daily meal counts for each member."}
        </p>
      </div>

      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <DateSelector selectedDate={formattedDate} />
          {isLocked && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20">
              Locked: Editing disabled for this month
            </div>
          )}
        </div>

        <MealEntryGrid
          members={(members as Member[]).filter((m: Member) => m.isActive)}
          initialMeals={meals}
          date={selectedDate}
          isLocked={isLocked || !admin}
        />
      </div>
    </div>
  );
}

function DateSelector({ selectedDate }: { selectedDate: string }) {
  return (
    <form className="flex items-center gap-4">
      <label htmlFor="date" className="text-sm font-medium text-slate-400">
        Select Date:
      </label>
      <input
        id="date"
        type="date"
        name="date"
        defaultValue={selectedDate}
        className="input w-48"
        // In a real app, you'd add onChange to submit or use a client component
      />
      <button type="submit" className="btn btn-outline">
        Go
      </button>
    </form>
  );
}

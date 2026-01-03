"use client";

import { useState } from "react";
import { updateMeal } from "@/app/actions/meal";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface Member {
  id: string;
  name: string;
}

interface Meal {
  memberId: string;
  count: number;
}

export function MealEntryGrid({
  members,
  initialMeals,
  date,
  isLocked,
}: {
  members: Member[];
  initialMeals: Meal[];
  date: Date;
  isLocked: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-800">
            <th className="pb-4 font-semibold text-slate-400">Member Name</th>
            <th className="pb-4 font-semibold text-slate-400">Meals Count</th>
            <th className="pb-4 font-semibold text-slate-400 text-right">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {members.map((member) => {
            const currentMeal = initialMeals.find(
              (m) => m.memberId === member.id
            );
            const count = currentMeal ? currentMeal.count : 0;

            return (
              <MealRow
                key={member.id}
                member={member}
                initialCount={count}
                date={date}
                isLocked={isLocked}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function MealRow({
  member,
  initialCount,
  date,
  isLocked,
}: {
  member: Member;
  initialCount: number;
  date: Date;
  isLocked: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"saved" | "error" | null>(null);
  const [customValue, setCustomValue] = useState<string>("");

  const handleMealChange = async (count: number) => {
    if (isLocked) return;

    setLoading(true);
    setStatus(null);

    const result = await updateMeal(member.id, date, count);

    setLoading(false);
    if (result.success) {
      setStatus("saved");
      setTimeout(() => setStatus(null), 2000);
    } else {
      setStatus("error");
    }
  };

  const handleManualInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val >= 0) {
      handleMealChange(val);
      setCustomValue(""); // Reset input to show the button/value properly if needed, usually we rely on optimistic updates or props.
      // Actually, standard behavior is to just let the backend update and props refresh.
    }
  };

  const isQuickValue = [0, 1, 2].includes(initialCount);

  return (
    <tr className="group">
      <td className="py-4 font-medium">{member.name}</td>
      <td className="py-4">
        <div className="flex items-center gap-2">
          {/* Quick Buttons */}
          {[0, 1, 2].map((val) => (
            <button
              key={val}
              disabled={isLocked || loading}
              onClick={() => handleMealChange(val)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                initialCount === val
                  ? "bg-indigo-600 text-white border-2 border-indigo-400"
                  : "bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-400"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {val}
            </button>
          ))}

          <span className="text-slate-600 mx-1">or</span>

          {/* Manual Input */}
          <input
            key={initialCount} // Force re-render when initialCount changes
            type="number"
            min="0"
            step="0.5"
            defaultValue={!isQuickValue ? initialCount : ""}
            placeholder="#"
            className={`w-16 h-10 rounded-lg bg-slate-900 border border-slate-700 px-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              !isQuickValue
                ? "border-indigo-500 text-indigo-400 font-bold"
                : "text-slate-400"
            }`}
            disabled={isLocked || loading}
            onBlur={handleManualInputBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur();
              }
            }}
          />
        </div>
      </td>
      <td className="py-4 text-right">
        <div className="flex justify-end items-center gap-2">
          {loading && (
            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
          )}
          {status === "saved" && (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          )}
          {status === "error" && (
            <AlertCircle className="w-4 h-4 text-rose-500" />
          )}
        </div>
      </td>
    </tr>
  );
}

"use client";

import { useRouter } from "next/navigation";

export function MonthSelector({ currentMonth }: { currentMonth: string }) {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMonth = e.target.value;
    router.push(`/?month=${newMonth}`);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="month"
        value={currentMonth}
        onChange={handleChange}
        className="input w-40"
      />
    </div>
  );
}

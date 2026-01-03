"use client";

import { useActionState } from "react";
import { changePassword } from "../actions/auth";

const initialState: { error?: string; success?: string } = {};

export function ChangePasswordForm() {
  const [state, action, isPending] = useActionState(
    changePassword,
    initialState
  );

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold mb-4">Change Password</h2>
      <form action={action} className="space-y-4">
        <div>
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium text-slate-400 mb-1"
          >
            Current Password
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            required
            className="input"
          />
        </div>

        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-slate-400 mb-1"
          >
            New Password
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            required
            className="input"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-slate-400 mb-1"
          >
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            className="input"
          />
        </div>

        {state?.error && (
          <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-md border border-red-500/20">
            {state.error}
          </div>
        )}

        {state?.success && (
          <div className="text-emerald-500 text-sm bg-emerald-500/10 p-3 rounded-md border border-emerald-500/20">
            {state.success}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isPending}
        >
          {isPending ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}

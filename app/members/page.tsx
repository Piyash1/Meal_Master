import {
  getMembers,
  toggleMemberStatus,
  addMember,
} from "@/app/actions/member";
import { Users, UserPlus, ToggleLeft, ToggleRight } from "lucide-react";
import { isAdmin } from "@/lib/auth-utils";

type Member = {
  id: string;
  name: string;
  isActive: boolean;
};

export default async function MembersPage() {
  const members = await getMembers();
  const admin = await isAdmin();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Members</h1>
          <p className="text-slate-400">
            {admin
              ? "Manage apartment members and their status."
              : "View apartment members."}
          </p>
        </div>
        {admin && <AddMemberForm />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(members as Member[]).map((member: Member) => (
          <div
            key={member.id}
            className="card p-6 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 font-bold text-lg">
                {member.name[0]}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    member.isActive
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-rose-500/10 text-rose-500"
                  }`}
                >
                  {member.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="flex items-center">
              {admin ? (
                <form
                  action={async () => {
                    "use server";
                    await toggleMemberStatus(member.id, !member.isActive);
                  }}
                >
                  <button className="p-2 hover:bg-slate-800 rounded-md transition-colors text-slate-400 hover:text-white">
                    {member.isActive ? (
                      <ToggleRight className="w-8 h-8 text-indigo-500" />
                    ) : (
                      <ToggleLeft className="w-8 h-8" />
                    )}
                  </button>
                </form>
              ) : (
                <div className="p-2 text-slate-400 opacity-50 cursor-not-allowed">
                  {member.isActive ? (
                    <ToggleRight className="w-8 h-8 text-indigo-500/50" />
                  ) : (
                    <ToggleLeft className="w-8 h-8" />
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddMemberForm() {
  return (
    <form
      action={async (formData: FormData) => {
        "use server";
        const name = formData.get("name") as string;
        if (name) await addMember(name);
      }}
      className="flex items-center gap-2"
    >
      <input
        name="name"
        placeholder="New member name..."
        className="input max-w-[200px]"
        required
      />
      <button type="submit" className="btn btn-primary gap-2">
        <UserPlus className="w-4 h-4" />
        Add
      </button>
    </form>
  );
}

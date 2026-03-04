import { prisma } from "@/lib/prisma";
import {
  User,
  ShieldBan,
  Trash2,
  ShieldCheck,
  Mail,
  Calendar,
} from "lucide-react";
import { revalidatePath } from "next/cache";

async function toggleBlockUser(userId: string, currentStatus: boolean) {
  "use server";
  await prisma.user.update({
    where: { id: userId },
    data: { isBlocked: !currentStatus },
  });
  revalidatePath("/admin/users");
}

async function deleteUser(userId: string) {
  "use server";
  await prisma.user.delete({
    where: { id: userId },
  });
  revalidatePath("/admin/users");
}

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { trips: true, locations: true },
      },
    },
  });

  return (
    <div className="space-y-10 py-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            User Management
          </h1>
          <p className="text-gray-500 font-medium italic select-none">
            Monitor and manage all registered accounts.
          </p>
        </div>
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          <span className="font-bold text-gray-900">
            {users.length} Users Found
          </span>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 italic">
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">
                  User Details
                </th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">
                  Role/Status
                </th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">
                  Activity
                </th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right pr-12">
                  Moderation
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden shadow-sm shadow-blue-50">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name || ""}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 font-black">
                            {user.name?.[0]?.toUpperCase() || "U"}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-gray-900 tracking-tight">
                          {user.name || "Anonymous"}
                        </span>
                        <div className="flex items-center gap-2 text-gray-400 text-xs font-bold">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-2">
                      <span
                        className={`w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          user.role === "ADMIN"
                            ? "bg-purple-50 text-purple-600 border-purple-200"
                            : "bg-blue-50 text-blue-600 border-blue-200"
                        }`}
                      >
                        {user.role}
                      </span>
                      {user.isBlocked && (
                        <span className="w-fit px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded-full text-[10px] font-black uppercase tracking-widest">
                          Blocked
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex justify-center gap-4 text-sm font-bold text-gray-500">
                      <div className="flex flex-col">
                        <span className="text-gray-900 text-lg font-black">
                          {user._count.trips}
                        </span>
                        <span className="text-[10px] uppercase text-gray-400 tracking-widest">
                          Trips
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-900 text-lg font-black">
                          {user._count.locations}
                        </span>
                        <span className="text-[10px] uppercase text-gray-400 tracking-widest">
                          Places
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right pr-12">
                    <div className="flex justify-end gap-3 items-center">
                      <form
                        action={toggleBlockUser.bind(
                          null,
                          user.id,
                          user.isBlocked,
                        )}
                      >
                        <button
                          type="submit"
                          title={user.isBlocked ? "Unblock User" : "Block User"}
                          className={`p-2 rounded-xl transition-all shadow-sm ${
                            user.isBlocked
                              ? "bg-green-50 text-green-600 hover:bg-green-600 hover:text-white"
                              : "bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white"
                          }`}
                        >
                          {user.isBlocked ? (
                            <ShieldCheck className="w-5 h-5" />
                          ) : (
                            <ShieldBan className="w-5 h-5" />
                          )}
                        </button>
                      </form>

                      <form
                        action={deleteUser.bind(null, user.id)}
                        onSubmit={(e) => {
                          if (
                            !confirm(
                              "Are you sure you want to delete this user forever? This cannot be undone.",
                            )
                          )
                            e.preventDefault();
                        }}
                      >
                        <button
                          type="submit"
                          title="Delete User"
                          className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </form>
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

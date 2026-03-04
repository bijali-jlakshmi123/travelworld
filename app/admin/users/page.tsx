import { prisma } from "@/lib/prisma";
import {
  Users,
  ShieldBan,
  Trash2,
  ShieldCheck,
  Mail,
  Calendar,
  Search,
  Filter,
  UserPlus,
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

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const users = await prisma.user.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        }
      : {},
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { trips: true, locations: true },
      },
    },
  });

  const totalAdmins = users.filter((u) => u.role === "ADMIN").length;
  const blockedUsers = users.filter((u) => u.isBlocked).length;

  return (
    <div className="space-y-10 py-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            User Management
          </h1>
          <p className="text-gray-500 font-medium italic">
            Monitoring and managing {users.length} registered accounts.
          </p>
        </div>

        <form className="relative group w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search by name or email..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-gray-900"
          />
        </form>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Total Accounts",
            value: users.length,
            icon: Users,
            color: "blue",
          },
          {
            label: "Administrators",
            value: totalAdmins,
            icon: ShieldCheck,
            color: "purple",
          },
          {
            label: "Blocked Users",
            value: blockedUsers,
            icon: ShieldBan,
            color: "red",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6 hover:shadow-md transition-shadow group"
          >
            <div
              className={`p-4 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:bg-${stat.color}-600 group-hover:text-white transition-all`}
            >
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                {stat.label}
              </p>
              <h3 className="text-2xl font-black text-gray-900">
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 italic">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Identity
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Authorization
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                  Engagement
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right pr-12">
                  Moderation
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300">
                        <UserPlus className="w-8 h-8" />
                      </div>
                      <p className="text-gray-400 font-bold italic">
                        No users matching your search...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50/30 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
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
                            {user.name || "User"}
                          </span>
                          <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold">
                            <Mail className="w-3 h-3 text-blue-400" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-2">
                        <span
                          className={`w-fit px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                            user.role === "ADMIN"
                              ? "bg-purple-50 text-purple-600 border-purple-100"
                              : "bg-blue-50 text-blue-600 border-blue-100"
                          }`}
                        >
                          {user.role}
                        </span>
                        {user.isBlocked && (
                          <span className="w-fit px-3 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
                            Access Blocked
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex justify-center gap-6 text-sm font-bold text-gray-500">
                        <div className="flex flex-col items-center">
                          <span className="text-gray-900 text-lg font-black leading-none">
                            {user._count.trips}
                          </span>
                          <span className="text-[9px] uppercase text-gray-400 tracking-widest font-black mt-1">
                            Trips
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-gray-900 text-lg font-black leading-none">
                            {user._count.locations}
                          </span>
                          <span className="text-[9px] uppercase text-gray-400 tracking-widest font-black mt-1">
                            Places
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right pr-12">
                      <div className="flex justify-end gap-3 items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <form
                          action={toggleBlockUser.bind(
                            null,
                            user.id,
                            user.isBlocked,
                          )}
                        >
                          <button
                            type="submit"
                            title={
                              user.isBlocked ? "Unblock User" : "Block User"
                            }
                            className={`p-3 rounded-2xl transition-all shadow-sm ${
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
                                "Permanently remove this user record? This cannot be undone.",
                              )
                            )
                              e.preventDefault();
                          }}
                        >
                          <button
                            type="submit"
                            title="Delete User"
                            className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

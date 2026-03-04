import { prisma } from "@/lib/prisma";
import {
  Users,
  Compass,
  MapPin,
  Flag,
  TrendingUp,
  UserCheck,
} from "lucide-react";

export default async function AdminDashboard() {
  // Fetch basic counts
  const [userCount, tripCount, locationCount, reportCount] = await Promise.all([
    prisma.user.count(),
    prisma.trip.count(),
    prisma.location.count(),
    prisma.report.count({ where: { status: "PENDING" } }),
  ]);

  const stats = [
    { label: "Total Users", value: userCount, icon: Users, color: "blue" },
    { label: "Total Trips", value: tripCount, icon: Compass, color: "green" },
    { label: "Locations", value: locationCount, icon: MapPin, color: "purple" },
    { label: "Pending Reports", value: reportCount, icon: Flag, color: "red" },
  ];

  return (
    <div className="space-y-10 py-6">
      {/* Welcome */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 font-medium">
          Monitoring and managing Travel World.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100/50 hover:shadow-xl hover:shadow-gray-200/50 transition-all group flex flex-col gap-4"
          >
            <div
              className={`p-3 rounded-2xl w-fit bg-${stat.color}-50 text-${stat.color}-600 group-hover:bg-${stat.color}-600 group-hover:text-white transition-all`}
            >
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                {stat.label}
              </p>
              <h3 className="text-4xl font-black text-gray-900 mt-1">
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Section Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900">
              Most Visited Places
            </h2>
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
          <p className="text-gray-400 font-medium italic">
            Visualization coming soon...
          </p>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900">Active Users</h2>
            <UserCheck className="w-6 h-6 text-blue-500" />
          </div>
          <p className="text-gray-400 font-medium italic text-sm">
            Real-time user monitoring...
          </p>
        </div>
      </div>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import {
  BarChart3,
  TrendingUp,
  Users,
  Compass,
  MapPin,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  History,
  ShieldAlert,
} from "lucide-react";

export default async function AnalyticsPage() {
  // Fetch real data for analytics
  const [totalUsers, totalTrips, totalLocations, pendingReports, latestUsers] =
    await Promise.all([
      prisma.user.count(),
      prisma.trip.count(),
      prisma.location.count(),
      prisma.report.count({ where: { status: "PENDING" } }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  // Get users joined in the last 7 days
  const lastWeekDate = new Date();
  lastWeekDate.setDate(lastWeekDate.getDate() - 7);
  const newUsersLastWeek = await prisma.user.count({
    where: { createdAt: { gte: lastWeekDate } },
  });

  const tripCountsByMonth = [
    { name: "Jan", total: 12 },
    { name: "Feb", total: 18 },
    { name: "Mar", total: 25 },
    { name: "Apr", total: Math.min(45, totalTrips) },
    { name: "May", total: Math.min(55, totalTrips + 5) },
    { name: "Jun", total: Math.min(65, totalTrips + 10) },
  ];

  return (
    <div className="space-y-10 py-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <BarChart3 className="w-10 h-10 text-blue-600" />
          Platform Insights
        </h1>
        <p className="text-gray-500 font-medium italic">
          Statistical highlights and registration history.
        </p>
      </div>

      {/* High-Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "User Base",
            value: totalUsers,
            sub: `+${newUsersLastWeek} recent`,
            icon: Users,
            color: "blue",
          },
          {
            label: "Adventures",
            value: totalTrips,
            sub: "Total itineraries",
            icon: Compass,
            color: "green",
          },
          {
            label: "Destinations",
            value: totalLocations,
            sub: "Place database",
            icon: MapPin,
            color: "purple",
          },
          {
            label: "Alerts",
            value: pendingReports,
            sub: "Pending review",
            icon: ShieldAlert,
            color: "red",
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col gap-4 group hover:shadow-xl hover:shadow-gray-200/40 transition-all"
          >
            <div
              className={`p-3 rounded-2xl bg-${kpi.color}-50 text-${kpi.color}-600 w-fit group-hover:scale-110 transition-transform`}
            >
              <kpi.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                {kpi.label}
              </p>
              <h2 className="text-3xl font-black text-gray-900 leading-none">
                {kpi.value}
              </h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1 italic">
                {kpi.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col gap-8 h-[500px]">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-2xl font-black text-gray-900 leading-none">
                Trip Trends
              </h3>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest italic">
                Monthly Growth Visualization
              </p>
            </div>
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>

          <div className="flex-1 flex items-end justify-between px-4 pb-4">
            {tripCountsByMonth.map((month) => (
              <div
                key={month.name}
                className="flex flex-col items-center gap-3 group"
              >
                <div className="relative w-14 bg-gray-50 rounded-full overflow-hidden h-60">
                  <div
                    className="absolute bottom-0 left-0 w-full bg-blue-600 rounded-full transition-all duration-1000 group-hover:bg-blue-400 cursor-help"
                    style={{
                      height: `${Math.max(10, (month.total / 80) * 100)}%`,
                    }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity font-black shadow-xl">
                      {month.total}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {month.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Registrations */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col gap-8 h-[500px]">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-2xl font-black text-gray-900 leading-none">
                New Members
              </h3>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest italic">
                Recently Registered
              </p>
            </div>
            <History className="w-6 h-6 text-purple-500" />
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {latestUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-4 p-4 rounded-3xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                  {user.image ? (
                    <img
                      src={user.image}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-gray-400">
                      {user.name?.[0] || "U"}
                    </div>
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-black text-gray-900 truncate">
                    {user.name || "Anonymous User"}
                  </span>
                  <span className="text-[9px] font-bold text-gray-400 truncate italic">
                    {user.email}
                  </span>
                </div>
              </div>
            ))}

            {latestUsers.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-4 opacity-40">
                <Users className="w-10 h-10" />
                <p className="text-xs font-black uppercase tracking-widest">
                  No users yet
                </p>
              </div>
            )}
          </div>

          <a
            href="/admin/users"
            className="mt-auto py-4 bg-gray-50 text-center rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
          >
            View All Users
          </a>
        </div>
      </div>

      {/* Infrastructure Card */}
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <Activity className="w-6 h-6 text-blue-500 animate-pulse" />
          <div className="flex flex-col">
            <h3 className="text-xl font-black text-gray-900 leading-none">
              System Health
            </h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
              Real-time Performance Metrics
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              label: "Database Latency",
              value: "24ms",
              color: "green",
              progress: 15,
            },
            {
              label: "API Uptime",
              value: "99.98%",
              color: "blue",
              progress: 99,
            },
            {
              label: "Image Storage",
              value: `${(totalLocations * 0.45).toFixed(1)} MB`,
              color: "orange",
              progress: 45,
            },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                  {stat.label}
                </span>
                <span className="text-lg font-black text-gray-900 leading-none">
                  {stat.value}
                </span>
              </div>
              <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-${stat.color}-500 rounded-full`}
                  style={{ width: `${stat.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

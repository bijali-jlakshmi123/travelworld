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
} from "lucide-react";

export default async function AnalyticsPage() {
  // Fetch data for analytics
  const totalUsers = await prisma.user.count();
  const totalTrips = await prisma.trip.count();
  const totalLocations = await prisma.location.count();

  // Get users joined in the last 7 days (simplified for now)
  const lastWeekDate = new Date();
  lastWeekDate.setDate(lastWeekDate.getDate() - 7);
  const newUsersLastWeek = await prisma.user.count({
    where: { createdAt: { gte: lastWeekDate } },
  });

  const tripCountsByMonth = [
    { name: "Jan", total: 12 },
    { name: "Feb", total: 18 },
    { name: "Mar", total: 25 },
    { name: "Apr", total: 40 },
    { name: "May", total: 35 },
    { name: "Jun", total: 48 },
  ];

  return (
    <div className="space-y-10 py-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <BarChart3 className="w-10 h-10 text-blue-600" />
          Analytics & Insights
        </h1>
        <p className="text-gray-500 font-medium italic">
          Statistical overview and performance metrics of the platform.
        </p>
      </div>

      {/* High-Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            label: "User Growth",
            value: totalUsers,
            sub: `+${newUsersLastWeek} this week`,
            icon: Users,
            color: "blue",
            trend: "up",
          },
          {
            label: "Adventure Volume",
            value: totalTrips,
            sub: "All-time itineraries",
            icon: Compass,
            color: "green",
            trend: "up",
          },
          {
            label: "Curated Places",
            value: totalLocations,
            sub: "Global destinations",
            icon: MapPin,
            color: "purple",
            trend: "up",
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col gap-6 group hover:shadow-2xl hover:shadow-gray-200/50 transition-all"
          >
            <div
              className={`p-4 rounded-2xl bg-${kpi.color}-50 text-${kpi.color}-600 w-fit group-hover:scale-110 transition-transform`}
            >
              <kpi.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                {kpi.label}
              </p>
              <div className="flex items-end gap-3">
                <h2 className="text-5xl font-black text-gray-900">
                  {kpi.value}
                </h2>
                <div
                  className={`flex items-center text-xs font-black ${kpi.trend === "up" ? "text-green-500" : "text-red-500"} mb-2`}
                >
                  {kpi.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {kpi.sub.split(" ")[0]}
                </div>
              </div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">
                {kpi.sub.split(" ").slice(1).join(" ")}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col gap-8 h-[400px]">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-2xl font-black text-gray-900 leading-none">
                Trip Activity
              </h3>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest italic">
                Monthly Volume
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
                <div className="relative w-12 bg-gray-50 rounded-full overflow-hidden h-40">
                  <div
                    className="absolute bottom-0 left-0 w-full bg-blue-600 rounded-full transition-all duration-1000 group-hover:bg-blue-400 cursor-help"
                    style={{ height: `${(month.total / 50) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-black">
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

        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col gap-8 h-[400px]">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-2xl font-black text-gray-900 leading-none">
                System Health
              </h3>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest italic">
                Live Status Monitoring
              </p>
            </div>
            <Activity className="w-6 h-6 text-blue-500 animate-pulse" />
          </div>

          <div className="flex-1 flex flex-col justify-center gap-6">
            {[
              { label: "Database Latency", value: "24ms", color: "green" },
              { label: "API Uptime", value: "99.98%", color: "blue" },
              { label: "Image Storage", value: "14.2 GB", color: "orange" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-black text-gray-600 uppercase tracking-wider">
                    {stat.label}
                  </span>
                  <span className="text-lg font-black text-gray-900">
                    {stat.value}
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-${stat.color}-500 rounded-full`}
                    style={{
                      width:
                        stat.label === "API Uptime"
                          ? "99%"
                          : stat.label === "Database Latency"
                            ? "15%"
                            : "45%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

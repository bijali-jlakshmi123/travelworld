import { prisma } from "@/lib/prisma";
import {
  Flag,
  Trash2,
  ShieldCheck,
  Mail,
  Calendar,
  User,
  Info,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";
import { revalidatePath } from "next/cache";

async function deleteReport(reportId: string) {
  "use server";
  await prisma.report.delete({
    where: { id: reportId },
  });
  revalidatePath("/admin/reports");
}

async function resolveReport(reportId: string, currentStatus: string) {
  "use server";
  await prisma.report.update({
    where: { id: reportId },
    data: { status: currentStatus === "PENDING" ? "RESOLVED" : "PENDING" },
  });
  revalidatePath("/admin/reports");
}

export default async function AdminReportsPage() {
  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true, image: true } },
    },
  });

  return (
    <div className="space-y-10 py-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Reports & Feedback
          </h1>
          <p className="text-gray-500 font-medium italic select-none">
            Review and resolve user-submitted reports and feedback.
          </p>
        </div>
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2">
          <Flag className="w-5 h-5 text-blue-600" />
          <span className="font-bold text-gray-900">
            {reports.length} Reports Found
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {reports.length === 0 && (
          <div className="lg:col-span-2 flex flex-col items-center justify-center p-20 bg-white rounded-[3rem] border border-gray-100 shadow-sm gap-4">
            <div className="w-20 h-20 bg-green-50 rounded-[2rem] flex items-center justify-center text-green-600">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <p className="text-xl font-black text-gray-900">All clear!</p>
            <p className="text-gray-400 font-medium italic">
              No pending reports at this moment.
            </p>
          </div>
        )}

        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-gray-200/50 transition-all p-10 group relative"
          >
            {/* Type Indicator */}
            <div
              className={`absolute top-0 left-0 w-2 h-full ${
                report.type === "spam"
                  ? "bg-orange-400"
                  : report.type === "incorrect_data"
                    ? "bg-blue-400"
                    : "bg-red-400"
              }`}
            />

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Flag
                  className={`w-5 h-5 ${
                    report.status === "PENDING"
                      ? "text-red-500 animate-pulse"
                      : "text-gray-400"
                  }`}
                />
                <span
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-dashed ${
                    report.status === "PENDING"
                      ? "bg-red-50 text-red-600 border-red-200"
                      : "bg-green-50 text-green-600 border-green-200"
                  }`}
                >
                  {report.status}
                </span>
                <span className="px-4 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500">
                  {report.type}
                </span>
              </div>
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                {new Date(report.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest italic flex items-center gap-2">
                  <MessageSquare className="w-3 h-3 text-blue-400" />
                  Report Details
                </h3>
                <p className="text-lg font-bold text-gray-900 tracking-tight leading-relaxed line-clamp-4 italic p-6 bg-gray-50 rounded-3xl border border-gray-100 overflow-hidden">
                  "{report.content}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gray-100 overflow-hidden">
                    {report.user.image ? (
                      <img
                        src={report.user.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-black text-gray-400">
                        ?
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-gray-900 tracking-tight">
                      {report.user.name || "Reporter"}
                    </span>
                    <span className="text-[10px] font-black text-gray-400 italic">
                      {report.user.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <form
                    action={resolveReport.bind(null, report.id, report.status)}
                  >
                    <button
                      type="submit"
                      className={`p-3 rounded-2xl transition-all shadow-sm flex items-center gap-2 font-black text-[10px] uppercase tracking-widest ${
                        report.status === "PENDING"
                          ? "bg-green-50 text-green-600 hover:bg-green-600 hover:text-white"
                          : "bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white"
                      }`}
                    >
                      {report.status === "PENDING" ? (
                        <>
                          <ShieldCheck className="w-5 h-5" />
                          Mark Resolved
                        </>
                      ) : (
                        <>
                          <ShieldAlert className="w-5 h-5" />
                          Re-open
                        </>
                      )}
                    </button>
                  </form>

                  <form action={deleteReport.bind(null, report.id)}>
                    <button className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

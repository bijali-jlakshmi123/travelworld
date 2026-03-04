import { prisma } from "@/lib/prisma";
import {
  Compass,
  ShieldBan,
  Trash2,
  ShieldCheck,
  MapPin,
  Calendar,
  Clock,
  Image as ImageIcon,
} from "lucide-react";
import { revalidatePath } from "next/cache";

async function toggleApproveTrip(tripId: string, currentStatus: boolean) {
  "use server";
  await prisma.trip.update({
    where: { id: tripId },
    data: { isApproved: !currentStatus },
  });
  revalidatePath("/admin/trips");
}

async function deleteTrip(tripId: string) {
  "use server";
  await prisma.trip.delete({
    where: { id: tripId },
  });
  revalidatePath("/admin/trips");
}

export default async function AdminTripsPage() {
  const trips = await prisma.trip.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true, image: true } },
      _count: { select: { itineraryItems: true } },
    },
  });

  return (
    <div className="space-y-10 py-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Trip Moderation
          </h1>
          <p className="text-gray-500 font-medium italic select-none">
            Review and manage user trips and itineraries.
          </p>
        </div>
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2">
          <Compass className="w-5 h-5 text-blue-600" />
          <span className="font-bold text-gray-900">
            {trips.length} Total Trips
          </span>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 italic">
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">
                  Trip Content
                </th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">
                  Creator
                </th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">
                  Itinerary
                </th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">
                  Status
                </th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right pr-12">
                  Moderation
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {trips.map((trip) => (
                <tr
                  key={trip.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 rounded-2xl bg-gray-100 overflow-hidden shadow-sm flex-shrink-0">
                        {trip.imageUrl ? (
                          <img
                            src={trip.imageUrl}
                            alt={trip.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Compass className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-1 overflow-hidden">
                        <span className="font-black text-gray-900 truncate tracking-tight">
                          {trip.title}
                        </span>
                        <div className="flex items-center gap-3 text-gray-400 text-[10px] font-black uppercase tracking-wider">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-red-400" />
                            {trip.destination}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-blue-400" />
                            {new Date(trip.startDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl overflow-hidden bg-gray-100">
                        {trip.user.image ? (
                          <img
                            src={trip.user.image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-black text-gray-400">
                            ?
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col flex-shrink-0">
                        <span className="text-xs font-black text-gray-900 tracking-tight">
                          {trip.user.name || "Anon"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex flex-col justify-center gap-1">
                      <span className="text-gray-900 text-lg font-black">
                        {trip._count.itineraryItems}
                      </span>
                      <span className="text-[10px] uppercase text-gray-400 tracking-widest font-black">
                        Plan Logs
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span
                      className={`w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-dashed mx-auto block ${
                        trip.isApproved
                          ? "bg-green-50 text-green-600 border-green-200"
                          : "bg-red-50 text-red-600 border-red-200"
                      }`}
                    >
                      {trip.isApproved ? "Approved" : "Blocked"}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right pr-12">
                    <div className="flex justify-end gap-3 items-center">
                      <form
                        action={toggleApproveTrip.bind(
                          null,
                          trip.id,
                          trip.isApproved,
                        )}
                      >
                        <button
                          type="submit"
                          title={
                            trip.isApproved ? "Block Trip" : "Approve Trip"
                          }
                          className={`p-2 rounded-xl transition-all shadow-sm ${
                            trip.isApproved
                              ? "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                              : "bg-green-50 text-green-600 hover:bg-green-600 hover:text-white"
                          }`}
                        >
                          {trip.isApproved ? (
                            <ShieldBan className="w-5 h-5" />
                          ) : (
                            <ShieldCheck className="w-5 h-5" />
                          )}
                        </button>
                      </form>

                      <form
                        action={deleteTrip.bind(null, trip.id)}
                        onSubmit={(e) => {
                          if (!confirm("Remove this trip permanently?"))
                            e.preventDefault();
                        }}
                      >
                        <button
                          type="submit"
                          title="Delete Trip"
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

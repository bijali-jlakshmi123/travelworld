import { prisma } from "@/lib/prisma";
import {
  MapPin,
  Globe,
  Edit,
  Trash2,
  Plus,
  Star,
  ShieldBan,
  ShieldCheck,
} from "lucide-react";
import { revalidatePath } from "next/cache";

async function deleteLocation(locationId: string) {
  "use server";
  await prisma.location.delete({
    where: { id: locationId },
  });
  revalidatePath("/admin/locations");
}

async function toggleApproveLocation(
  locationId: string,
  currentStatus: boolean,
) {
  "use server";
  await prisma.location.update({
    where: { id: locationId },
    data: { isApproved: !currentStatus },
  });
  revalidatePath("/admin/locations");
}

export default async function AdminLocationsPage() {
  const locations = await prisma.location.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true } },
    },
  });

  return (
    <div className="space-y-10 py-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Location Database
          </h1>
          <p className="text-gray-500 font-medium italic select-none">
            Manage global destinations and user-added places.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-gray-900">
              {locations.length} Sites Managed
            </span>
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all font-bold flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Destination
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-gray-200/50 transition-all group"
          >
            <div className="h-56 overflow-hidden relative">
              {loc.imageUrl ? (
                <img
                  src={loc.imageUrl}
                  alt={loc.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                  <Globe className="w-12 h-12" />
                </div>
              )}
              <div className="absolute top-6 left-6 flex flex-col gap-2 pointer-events-none">
                <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-900 shadow-sm border border-gray-200/50">
                  {loc.country}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm border border-gray-200/50 backdrop-blur-md ${
                    loc.isApproved
                      ? "bg-green-100/90 text-green-700"
                      : "bg-red-100/90 text-red-700"
                  }`}
                >
                  {loc.isApproved ? "Public" : "Hidden"}
                </span>
              </div>
            </div>

            <div className="p-8 flex flex-col flex-1 gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
                  {loc.name}
                </h3>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  {loc.country}
                </p>
              </div>

              <p className="text-sm text-gray-500 font-medium leading-relaxed line-clamp-3 italic">
                {loc.description ||
                  "No description provided for this destination..."}
              </p>

              <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                    Added By
                  </span>
                  <span className="text-xs font-bold text-gray-700">
                    {loc.user.name || "Anon"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <form
                    action={toggleApproveLocation.bind(
                      null,
                      loc.id,
                      loc.isApproved,
                    )}
                  >
                    <button
                      type="submit"
                      title={
                        loc.isApproved ? "Hide Location" : "Approve Location"
                      }
                      className={`p-3 rounded-2xl transition-all shadow-sm ${
                        loc.isApproved
                          ? "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                          : "bg-green-50 text-green-600 hover:bg-green-600 hover:text-white"
                      }`}
                    >
                      {loc.isApproved ? (
                        <ShieldBan className="w-5 h-5" />
                      ) : (
                        <ShieldCheck className="w-5 h-5" />
                      )}
                    </button>
                  </form>

                  <button className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                    <Edit className="w-5 h-5" />
                  </button>

                  <form
                    action={deleteLocation.bind(null, loc.id)}
                    onSubmit={(e) => {
                      if (!confirm("Permanently remove this location?"))
                        e.preventDefault();
                    }}
                  >
                    <button
                      type="submit"
                      className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    >
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

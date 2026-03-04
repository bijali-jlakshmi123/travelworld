import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ArrowLeft, Map as MapIcon, Globe2, Layers } from "lucide-react";
import Link from "next/link";
import MapComponent from "@/components/MapComponent";

export default async function MapPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch all user locations exactly as we do for the globe
  const locations = await prisma.location.findMany({
    where: { userId: session.user.id },
  });

  const visitedCount = locations.filter((l) => l.visited).length;
  const bucketListCount = locations.length - visitedCount;

  return (
    <div className="h-screen w-full bg-[#17263c] relative overflow-hidden flex flex-col">
      {/* Top Navbar / Header overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6 flex justify-between items-start pointer-events-none">
        {/* Left Side: Back button */}
        <div className="pointer-events-auto flex flex-col gap-3">
          <Link
            href="/locations"
            className="flex items-center gap-2 bg-white/95 hover:bg-white text-gray-900 border border-gray-200 px-4 py-2 rounded-full transition-all text-sm font-semibold shadow-lg backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <Link
            href="/globe"
            className="flex items-center gap-2 bg-blue-600/90 hover:bg-blue-500 text-white border border-blue-500/50 px-4 py-2 rounded-full transition-all text-sm font-semibold shadow-[0_0_15px_rgba(37,99,235,0.5)] backdrop-blur-md"
          >
            <Globe2 className="w-4 h-4" />
            Launch 3D Globe
          </Link>
        </div>

        {/* Right Side: Stats Panel */}
        <div className="bg-white/95 backdrop-blur-xl border border-gray-100 rounded-3xl p-6 w-80 shadow-2xl pointer-events-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <MapIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-none">
                Map View
              </h1>
              <p className="text-xs text-blue-600 mt-1 font-semibold flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> Satellite Hybrid
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Total Places
              </div>
              <div className="text-2xl font-black text-gray-900">
                {locations.length}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                Visited
              </div>
              <div className="text-2xl font-black text-emerald-500">
                {visitedCount}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-amber-600 uppercase tracking-widest flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                Bucket List
              </div>
              <div className="text-2xl font-black text-amber-500">
                {bucketListCount}
              </div>
            </div>
          </div>

          {locations.length === 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                You haven't added any locations yet. The map will populate once
                you begin saving destinations!
              </p>
              <Link
                href="/locations/new"
                className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-bold transition-colors"
              >
                Add Your First Location
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Embedded Map Component */}
      <div className="flex-1 w-full relative z-10">
        <MapComponent locations={locations} />
      </div>
    </div>
  );
}

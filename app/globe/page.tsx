import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ArrowLeft, Globe2, MapPin } from "lucide-react";
import Link from "next/link";
import LocationsGlobe from "@/components/LocationsGlobe";

export default async function FullGlobePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch all user locations
  const locations = await prisma.location.findMany({
    where: { userId: session.user.id },
  });

  const visitedCount = locations.filter((l) => l.visited).length;
  const bucketListCount = locations.length - visitedCount;

  return (
    <div className="h-screen w-full bg-black relative overflow-hidden flex flex-col">
      {/* Top Navbar / Header overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6 flex justify-between items-start pointer-events-none">
        {/* Left Side: Back button */}
        <div className="pointer-events-auto">
          <Link
            href="/locations"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full transition-all text-sm font-medium shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Locations
          </Link>
        </div>

        {/* Right Side: Stats Panel */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 w-80 shadow-2xl pointer-events-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-blue-500/20 rounded-xl">
              <Globe2 className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white leading-none">
                Your World
              </h1>
              <p className="text-xs text-blue-300 mt-1 font-medium">
                Interactive Discovery
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Total Places
              </p>
              <p className="text-2xl font-bold text-white">
                {locations.length}
              </p>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                Visited
              </div>
              <p className="text-2xl font-bold text-emerald-400">
                {visitedCount}
              </p>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div>
                Bucket List
              </div>
              <p className="text-2xl font-bold text-amber-400">
                {bucketListCount}
              </p>
            </div>
          </div>

          {locations.length === 0 && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-sm text-gray-400 leading-relaxed">
                You haven't added any locations yet. The globe will populate
                once you begin saving destinations!
              </p>
              <Link
                href="/locations/new"
                className="mt-4 block text-center w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Add Your First Location
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Floating Instructions */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none hidden sm:block">
        <div className="bg-black/50 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/10 shadow-lg flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-300 font-medium">
            Click and drag to rotate the globe. Scroll to zoom in and out.
          </span>
        </div>
      </div>

      {/* Embedded Globe Component */}
      <div className="flex-1 w-full relative z-10 cursor-move">
        <LocationsGlobe locations={locations} interactive={true} />
      </div>
    </div>
  );
}

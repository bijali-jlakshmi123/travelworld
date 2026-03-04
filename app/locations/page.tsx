import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Plus,
  MapPin,
  Map,
  Globe2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import LocationsGlobe from "@/components/LocationsGlobe";

export default async function LocationsPage() {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white rounded-2xl shadow-xl max-w-md w-full text-center">
          <Map className="w-16 h-16 mx-auto text-emerald-500 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Your Places
          </h2>
          <p className="text-gray-500 mb-8">
            Please sign in to view and manage your location bucket list.
          </p>
        </div>
      </div>
    );
  }

  const locations = await prisma.location.findMany({
    where: { userId: session.user?.id },
    orderBy: { createdAt: "desc" },
  });

  const visitedLocations = locations.filter((loc) => loc.visited);
  const bucketListLocations = locations.filter((loc) => !loc.visited);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      {/* Dashboard Header Banner */}
      <div className="bg-white border-b border-gray-100 mb-8 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                My Global Places
              </h1>
              <p className="text-gray-500 mt-2 text-lg">
                You have saved {locations.length}{" "}
                {locations.length === 1 ? "location" : "locations"}.
              </p>
            </div>
            <Link href="/locations/new">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md rounded-xl px-6 h-12 text-md transition-all flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Location
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <Globe2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Saved</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {locations.length}
              </h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Bucket List</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {bucketListLocations.length}
              </h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Places Visited
              </p>
              <h3 className="text-2xl font-bold text-gray-900">
                {visitedLocations.length}
              </h3>
            </div>
          </div>
        </div>

        {locations.length > 0 && (
          <div className="bg-[#0f172a] rounded-3xl shadow-２xl border border-gray-800 p-2 overflow-hidden relative shadow-lg">
            <div className="absolute top-6 left-8 z-10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-emerald-400" />
                Interactive Globe
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Drag to rotate. See where you've been and where you're going.
              </p>
              <div className="flex items-center gap-4 mt-3">
                <Link
                  href="/globe"
                  className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1 group"
                >
                  Enter Full Screen Mode
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/map"
                  className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors inline-flex items-center gap-1 group"
                >
                  View 2D Map
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            {/* The Globe Component */}
            <div className="w-full h-[450px] group">
              <LocationsGlobe locations={locations} />
            </div>

            {/* Simple Legend */}
            <div className="absolute bottom-6 right-8 z-10 hidden sm:flex items-center gap-4 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                <span className="text-xs text-white font-medium">Visited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]"></div>
                <span className="text-xs text-white font-medium">
                  Bucket List
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Locations Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Your Locations Collection
            </h2>
          </div>

          {locations.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 border-dashed p-12 text-center flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <MapPin className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No locations saved yet
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-8">
                Build your perfect travel bucket list by saving interesting
                places worldwide. Keep track of what you've visited versus
                what's next.
              </p>
              <Link href="/locations/new">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md h-12 px-8">
                  Add Your First Place
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {locations.map((loc) => {
                return (
                  <div key={loc.id} className="group flex h-full">
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 w-full flex flex-col group-hover:-translate-y-1">
                      {/* Image header */}
                      <div className="h-40 relative overflow-hidden bg-gray-200">
                        {loc.imageUrl ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={loc.imageUrl}
                              alt={loc.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-gray-900/60 via-gray-900/10 to-transparent"></div>
                          </>
                        ) : (
                          <div className="w-full h-full bg-linear-to-br from-emerald-400 to-teal-600 group-hover:scale-105 transition-transform duration-500 relative">
                            <div className="absolute inset-0 bg-black/10"></div>
                            {/* Abstract decorative elements */}
                            <div className="absolute top-4 left-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
                            <div className="absolute bottom-[-10px] right-[-10px] w-16 h-16 bg-teal-300 opacity-20 rounded-full blur-lg"></div>
                          </div>
                        )}

                        {/* Status Badge */}
                        <div className="absolute top-3 right-3 z-10">
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm backdrop-blur-md flex items-center gap-1.5 ${
                              loc.visited
                                ? "bg-blue-100/95 text-blue-700"
                                : "bg-amber-100/95 text-amber-700"
                            }`}
                          >
                            {loc.visited ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" /> Visited
                              </>
                            ) : (
                              <>
                                <MapPin className="w-3.5 h-3.5" /> Bucket List
                              </>
                            )}
                          </span>
                        </div>

                        {/* Title positioned over image */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 z-10 bg-linear-to-t from-black/80 to-transparent">
                          <h3 className="text-lg font-bold text-white line-clamp-1">
                            {loc.name}
                          </h3>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="space-y-3 mb-4 flex-1">
                          <div className="flex items-start gap-3 text-gray-700">
                            <div className="bg-gray-50 p-1.5 rounded-lg shrink-0">
                              <Globe2 className="w-4 h-4 text-emerald-600" />
                            </div>
                            <span className="text-sm font-medium line-clamp-1 mt-1">
                              {loc.country}
                            </span>
                          </div>

                          {loc.description && (
                            <div className="mt-4 wrap-break-word">
                              <p className="text-sm text-gray-500 line-clamp-3">
                                {loc.description}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Action row at bottom */}
                        <div className="flex flex-row items-center justify-between text-sm font-semibold text-emerald-600 pt-4 border-t border-gray-100 mt-auto cursor-pointer hover:text-emerald-700">
                          <span>View Details</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

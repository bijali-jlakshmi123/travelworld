import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, MapPin, Calendar, Globe, Plane, ArrowRight } from "lucide-react";

export default async function TripsPage() {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white rounded-2xl shadow-xl max-w-md w-full text-center">
          <Globe className="w-16 h-16 mx-auto text-blue-500 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Travel World
          </h2>
          <p className="text-gray-500 mb-8">
            Please sign in to view and manage your trips.
          </p>
        </div>
      </div>
    );
  }

  const trips = await prisma.trip.findMany({
    where: { userId: session.user?.id },
    orderBy: { startDate: "asc" },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingTrips = trips.filter(
    (trip) => new Date(trip.startDate) >= today,
  );
  const pastTrips = trips.filter((trip) => new Date(trip.startDate) < today);

  const sortedTrips = [
    ...upcomingTrips.sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    ),
    ...pastTrips.sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    ),
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      {/* Dashboard Header Banner */}
      <div className="bg-white border-b border-gray-100 mb-8 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Welcome back, {session.user?.name?.split(" ")[0] || "Traveler"}{" "}
                👋
              </h1>
              <p className="text-gray-500 mt-2 text-lg">
                You have {upcomingTrips.length} upcoming{" "}
                {upcomingTrips.length === 1 ? "trip" : "trips"} planned.
              </p>
            </div>
            <Link href="/trips/new">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-xl px-6 h-12 text-md transition-all flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Plan New Trip
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <Plane className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Trips</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {trips.length}
              </h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Upcoming</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {upcomingTrips.length}
              </h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Past Adventures
              </p>
              <h3 className="text-2xl font-bold text-gray-900">
                {pastTrips.length}
              </h3>
            </div>
          </div>
        </div>

        {/* Trips Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Your Itineraries
            </h2>
          </div>

          {trips.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 border-dashed p-12 text-center flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Globe className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No trips planned yet
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-8">
                Ready for your next adventure? Start planning your perfect
                itinerary, keep track of reservations, and organize your daily
                activities.
              </p>
              <Link href="/trips/new">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md h-12 px-8">
                  Create Your First Trip
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedTrips.map((trip) => {
                const tripStartDate = new Date(trip.startDate);
                const isPast = tripStartDate < today;

                return (
                  <Link
                    href={`/trips/${trip.id}`}
                    key={trip.id}
                    className="group flex h-full"
                  >
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 w-full flex flex-col group-hover:-translate-y-1">
                      {/* Image header */}
                      <div className="h-48 relative overflow-hidden bg-gray-200">
                        {trip.imageUrl ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={trip.imageUrl}
                              alt={trip.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-gray-900/60 via-gray-900/10 to-transparent"></div>
                          </>
                        ) : (
                          <div className="w-full h-full bg-linear-to-br from-blue-400 to-indigo-600 group-hover:scale-105 transition-transform duration-500 relative">
                            <div className="absolute inset-0 bg-black/10"></div>
                            {/* Abstract decorative elements */}
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
                            <div className="absolute bottom-4 left-4 w-16 h-16 bg-blue-300 opacity-20 rounded-full blur-xl"></div>
                          </div>
                        )}

                        {/* Status Badge & Actions */}
                        <div className="absolute top-4 right-4 z-10">
                          <span
                            className={`px-3 py-1.5 text-xs font-semibold rounded-full shadow-sm backdrop-blur-md ${
                              isPast
                                ? "bg-gray-100/90 text-gray-700"
                                : "bg-white/95 text-blue-700"
                            }`}
                          >
                            {isPast ? "Completed" : "Upcoming"}
                          </span>
                        </div>

                        {/* Title positioned over image */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 z-10 bg-linear-to-t from-black/80 to-transparent">
                          <h3 className="text-xl font-bold text-white line-clamp-1">
                            {trip.title}
                          </h3>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="space-y-3 mb-4 flex-1">
                          <div className="flex items-start gap-3 text-gray-700">
                            <div className="bg-gray-50 p-1.5 rounded-lg shrink-0">
                              <MapPin className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium line-clamp-2 mt-1">
                              {trip.destination}
                            </span>
                          </div>
                          <div className="flex items-start gap-3 text-gray-700">
                            <div className="bg-gray-50 p-1.5 rounded-lg shrink-0">
                              <Calendar className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm mt-1">
                              {new Date(trip.startDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                              {trip.endDate &&
                                new Date(trip.endDate).getTime() !==
                                  new Date(trip.startDate).getTime() &&
                                ` - ${new Date(trip.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
                            </span>
                          </div>

                          {trip.notes && (
                            <div className="mt-4 wrap-break-word">
                              <p className="text-sm text-gray-500 line-clamp-2">
                                {trip.notes}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Action row at bottom */}
                        <div className="flex flex-row items-center justify-between text-sm font-semibold text-blue-600 pt-4 border-t border-gray-100 mt-auto">
                          <span>View Details</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

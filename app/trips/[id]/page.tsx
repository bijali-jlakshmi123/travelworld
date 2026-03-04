import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Clock, MapPin, Plus } from "lucide-react";
import Link from "next/link";
import { ItineraryList } from "@/components/ItineraryList";
import { addItineraryItem } from "./actions";

export default async function TripDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/trips");
  }

  const trip = await prisma.trip.findUnique({
    where: {
      id: id,
      userId: session.user.id,
    },
    include: {
      itineraryItems: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!trip) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          <Link
            href="/trips"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Trip Overview Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-8">
              {trip.imageUrl ? (
                <div className="h-48 relative overflow-hidden bg-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={trip.imageUrl}
                    alt={trip.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-gray-900/80 to-transparent"></div>
                  <div className="absolute bottom-4 left-6 right-6 z-10">
                    <h1 className="text-2xl font-bold text-white leading-tight">
                      {trip.title}
                    </h1>
                  </div>
                </div>
              ) : (
                <div className="bg-linear-to-r from-blue-600 to-indigo-700 px-6 py-8 text-white relative">
                  <div className="relative z-10">
                    <h1 className="text-2xl font-bold tracking-tight mb-2">
                      {trip.title}
                    </h1>
                  </div>
                </div>
              )}

              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3 text-gray-700">
                  <div className="bg-blue-50 p-2 rounded-xl shrink-0">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Destination
                    </h3>
                    <span className="text-sm font-semibold text-gray-900">
                      {trip.destination}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-gray-700">
                  <div className="bg-green-50 p-2 rounded-xl shrink-0">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Dates
                    </h3>
                    <span className="text-sm font-semibold text-gray-900">
                      {new Date(trip.startDate).toLocaleDateString()} -{" "}
                      {new Date(trip.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {trip.notes && (
                  <div className="pt-4 border-t border-gray-100 mt-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Notes
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-4">
                      {trip.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Itinerary Dnd List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Itinerary
                  </h2>
                  <p className="text-gray-500 mt-1">
                    Drag and drop to reorder your planned stops
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                  <MapPin className="w-6 h-6" />
                </div>
              </div>

              {/* Server Client Wrapper -> Client handles Drag/Drop interactively */}
              <div className="mb-10">
                <ItineraryList
                  initialItems={trip.itineraryItems}
                  tripId={trip.id}
                />
              </div>

              {/* Add New Stop Form */}
              <div className="bg-gray-50/80 rounded-2xl border border-gray-200 p-6 mt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-600" />
                  Add New Stop
                </h3>
                <form
                  action={async (formData) => {
                    "use server";
                    await addItineraryItem(formData);
                  }}
                  className="space-y-4"
                >
                  <input type="hidden" name="tripId" value={trip.id} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1 md:col-span-2">
                      <label
                        htmlFor="title"
                        className="text-xs font-semibold text-gray-600"
                      >
                        Activity Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        required
                        placeholder="E.g., Visit the Louvre, Airport Transfer"
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 flex-1 focus:ring-blue-500 outline-none transition-shadow"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label
                        htmlFor="time"
                        className="text-xs font-semibold text-gray-600"
                      >
                        Time (Optional)
                      </label>
                      <input
                        type="text"
                        name="time"
                        placeholder="10:00 AM, Evening, etc."
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 flex-1 focus:ring-blue-500 outline-none transition-shadow"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label
                        htmlFor="description"
                        className="text-xs font-semibold text-gray-600"
                      >
                        Notes (Optional)
                      </label>
                      <textarea
                        name="description"
                        placeholder="Reservation #, things to remember..."
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 flex-1 focus:ring-blue-500 outline-none transition-shadow block resize-y min-h-20"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md active:scale-[0.98] transition-all"
                  >
                    Add to Itinerary
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

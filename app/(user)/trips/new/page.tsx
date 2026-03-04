"use client";

import { useState, useTransition } from "react";
import { createTrip } from "./actions";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  FileText,
  Image as ImageIcon,
  Type,
  PlaneTakeoff,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function NewTripPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      setError(null);
      const result = await createTrip(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8">
          <Link
            href="/trips"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-linear-to-r from-blue-600 to-indigo-700 px-8 py-10 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm mb-4">
                <PlaneTakeoff className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                Plan a New Adventure
              </h1>
              <p className="text-blue-100 text-lg">
                Exciting journeys await. Where are you heading next?
              </p>
            </div>

            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 mb-[-100px] w-48 h-48 bg-blue-400 opacity-20 rounded-full blur-2xl"></div>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-start">
                  <div className="bg-red-100 p-1 rounded-full mr-3 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  </div>
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label
                    htmlFor="title"
                    className="text-sm font-semibold text-gray-700 block"
                  >
                    Trip Title
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Type className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      required
                      placeholder="E.g., Summer in Paris, Weekend Getaway"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label
                    htmlFor="destination"
                    className="text-sm font-semibold text-gray-700 block"
                  >
                    Destination
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="destination"
                      id="destination"
                      required
                      placeholder="City, Country or Region"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="startDate"
                    className="text-sm font-semibold text-gray-700 block"
                  >
                    Start Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="startDate"
                      id="startDate"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-gray-50 focus:bg-white text-gray-900"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="endDate"
                    className="text-sm font-semibold text-gray-700 block"
                  >
                    End Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="endDate"
                      id="endDate"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-gray-50 focus:bg-white text-gray-900"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label
                    htmlFor="imageUrl"
                    className="text-sm font-semibold text-gray-700 flex items-center justify-between"
                  >
                    Cover Image URL
                    <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                      Optional
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ImageIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="url"
                      name="imageUrl"
                      id="imageUrl"
                      placeholder="https://example.com/image.jpg"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label
                    htmlFor="notes"
                    className="text-sm font-semibold text-gray-700 flex items-center justify-between"
                  >
                    Trip Notes & Itinerary Ideas
                    <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                      Optional
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      name="notes"
                      id="notes"
                      rows={4}
                      placeholder="Jot down places you want to visit, restaurant recommendations, etc."
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400 resize-y"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 mt-8 flex justify-end gap-4">
                <Link
                  href="/trips"
                  className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-8 py-3 rounded-xl bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Trip"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

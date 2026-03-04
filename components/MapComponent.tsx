"use client";

import { useMemo, useState, useCallback } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { MapPin, Navigation } from "lucide-react";

export type MapLocation = {
  id: string;
  lat: number | null;
  lng: number | null;
  name: string;
  country: string;
  visited: boolean;
  description?: string | null;
  imageUrl?: string | null;
};

interface MapComponentProps {
  locations: MapLocation[];
}

// Map bounds and sizing
const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

// Default center (e.g., somewhere central to US/Europe or User context)
// If no locations, center on world
const defaultCenter = {
  lat: 40.7128,
  lng: -74.006, // NYC
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }],
    },
  ],
};

export default function MapComponent({ locations }: MapComponentProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

  const [selectedLoc, setSelectedLoc] = useState<MapLocation | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const center = useMemo(() => {
    const firstValid = locations.find((l) => l.lat !== null && l.lng !== null);
    if (firstValid && firstValid.lat !== null && firstValid.lng !== null) {
      return { lat: firstValid.lat, lng: firstValid.lng };
    }
    return defaultCenter;
  }, [locations]);

  const onMapLoad = useCallback(
    (map: google.maps.Map) => {
      setMap(map);
      // Fit bounds if there are multiple locations
      if (locations.length > 1) {
        const bounds = new window.google.maps.LatLngBounds();
        locations.forEach(({ lat, lng }) => {
          if (lat && lng) bounds.extend({ lat, lng });
        });
        map.fitBounds(bounds);
      }
    },
    [locations],
  );

  // If loading fails or hasn't loaded yet
  if (loadError)
    return (
      <div className="p-8 text-center text-red-500 font-medium bg-red-50 rounded-2xl border border-red-100 flex items-center justify-center h-full w-full">
        Error loading Google Maps. Did you add a
        NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?
      </div>
    );
  if (!isLoaded)
    return (
      <div className="p-8 text-center text-blue-500 font-medium bg-blue-50 rounded-2xl animate-pulse flex items-center justify-center h-full w-full">
        Loading Maps Interface...
      </div>
    );

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-xl border border-gray-200">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={locations.length > 1 ? 4 : 10}
        center={center}
        options={options}
        onLoad={onMapLoad}
        onClick={() => setSelectedLoc(null)} // Close window on map click
      >
        {locations.map((loc) => {
          if (loc.lat === null || loc.lng === null) return null;

          return (
            <Marker
              key={loc.id}
              position={{ lat: loc.lat, lng: loc.lng }}
              icon={{
                url: loc.visited
                  ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                  : "http://maps.google.com/mapfiles/ms/icons/orange-dot.png",
              }}
              onClick={() => {
                setSelectedLoc(loc);
                map?.panTo({ lat: loc.lat as number, lng: loc.lng as number });
              }}
            />
          );
        })}

        {selectedLoc &&
          selectedLoc.lat !== null &&
          selectedLoc.lng !== null && (
            <InfoWindow
              position={{ lat: selectedLoc.lat, lng: selectedLoc.lng }}
              onCloseClick={() => setSelectedLoc(null)}
              options={{ pixelOffset: new window.google.maps.Size(0, -30) }}
            >
              <div className="p-1 max-w-[200px]">
                {selectedLoc.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedLoc.imageUrl}
                    alt={selectedLoc.name}
                    className="w-full h-24 object-cover rounded-lg mb-3 shadow-sm"
                  />
                ) : (
                  <div className="w-full h-16 bg-linear-to-tr from-blue-500 to-indigo-600 rounded-lg mb-3 flex items-center justify-center text-white shadow-sm">
                    <Navigation className="w-6 h-6" />
                  </div>
                )}
                <h3 className="font-bold text-gray-900 text-sm leading-tight flex items-center gap-1.5">
                  <MapPin
                    className={`w-3.5 h-3.5 ${selectedLoc.visited ? "text-emerald-500" : "text-amber-500"}`}
                  />
                  {selectedLoc.name}
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  {selectedLoc.country}
                </p>

                <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      selectedLoc.visited
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {selectedLoc.visited ? "Visited" : "Bucket List"}
                  </span>
                </div>
              </div>
            </InfoWindow>
          )}
      </GoogleMap>
    </div>
  );
}

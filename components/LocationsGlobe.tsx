"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

type LocationPoint = {
  lat: number;
  lng: number;
  size: number;
  color: string;
  name: string;
  country: string;
  visited: boolean;
};

export default function LocationsGlobe({
  locations,
  interactive = false,
}: {
  locations: any[];
  interactive?: boolean;
}) {
  const [points, setPoints] = useState<LocationPoint[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 400 });
  const containerRef = useRef<HTMLDivElement>(null);
  const globeEl = useRef<any>(null);

  useEffect(() => {
    // Generate valid map points
    const validPoints = locations
      .filter((loc) => loc.lat !== null && loc.lng !== null)
      .map((loc) => ({
        lat: loc.lat,
        lng: loc.lng,
        size: 0.1,
        color: loc.visited ? "#10b981" : "#f59e0b", // emerald vs amber
        name: loc.name,
        country: loc.country,
        visited: loc.visited,
      }));
    setPoints(validPoints);

    // Initial width sizing
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight || 400,
      });
    }

    // Handle window resize
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight || 400,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [locations]);

  // Setup auto-rotation once the globe is loaded
  const onGlobeReady = () => {
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1.0;
      controls.enableZoom = interactive; // Disable zoom to keep it looking like a neat widget if not interactive
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center cursor-move overflow-hidden rounded-2xl"
    >
      {typeof window !== "undefined" && (
        <Globe
          ref={globeEl}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          pointsData={points}
          pointAltitude="size"
          pointColor="color"
          pointRadius={1}
          pointLabel={(d: any) => `
            <div style="background: rgba(0,0,0,0.8); padding: 8px; border-radius: 8px; color: white; font-family: sans-serif;">
              <div style="font-weight: bold;">${d.name}</div>
              <div style="font-size: 0.8em; color: #cbd5e1;">${d.country}</div>
              <div style="font-size: 0.8em; margin-top: 4px; color: ${d.color}; font-weight: bold;">
                ${d.visited ? "✓ Visited" : "★ Bucket List"}
              </div>
            </div>
          `}
          onGlobeReady={onGlobeReady}
        />
      )}
    </div>
  );
}

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const RoutesMap = ({ origin, destination }) => {
  const mapRef = useRef(null);        // Leaflet map instance
  const mapContainerRef = useRef();   // DOM container
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    if (!origin || !destination) return;
    if (!mapContainerRef.current) return;

    // 🔥 CLEANUP PREVIOUS MAP SAFELY
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(mapContainerRef.current);
    mapRef.current = map;

    const originPoint = L.latLng(origin.lat, origin.lng);
    const destinationPoint = L.latLng(destination.lat, destination.lng);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // 📍 MARKERS
    L.marker(originPoint).addTo(map).bindPopup("📍 Donor");
    L.marker(destinationPoint).addTo(map).bindPopup("🏥 NGO");

    // 🔍 FIT MAP TO BOTH
    map.fitBounds(
      L.latLngBounds([originPoint, destinationPoint]),
      { padding: [80, 80] }
    );

    // 🛣️ ROUTE + DISTANCE
    L.Routing.control({
      waypoints: [originPoint, destinationPoint],
      addWaypoints: false,
      draggableWaypoints: false,
      routeWhileDragging: false,
      show: false,
      createMarker: () => null,
    })
      .on("routesfound", (e) => {
        const meters = e.routes[0].summary.totalDistance;
        setDistance((meters / 1000).toFixed(2) + " km");
      })
      .addTo(map);

    setTimeout(() => map.invalidateSize(), 300);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [origin, destination]);

  return (
    <div className="w-full h-full relative">
      {distance && (
        <div className="absolute top-4 right-4 z-[1000] bg-white shadow px-4 py-2 rounded-full text-sm font-semibold">
          Distance: {distance}
        </div>
      )}

      {/* ✅ IMPORTANT: HEIGHT MUST EXIST */}
      <div
        ref={mapContainerRef}
        className="w-full h-full"
      />
    </div>
  );
};

export default RoutesMap;

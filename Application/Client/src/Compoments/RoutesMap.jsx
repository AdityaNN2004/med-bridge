import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const RoutesMap = () => {
  useEffect(() => {
    // ✅ Direct coordinates (Nagpur)
    const origin = L.latLng(21.1458, 79.0882);      // Gandhi Nagar (approx)
    const destination = L.latLng(21.1239, 79.0706); // Parsodi IT Park (approx)

    const map = L.map("map").setView(origin, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    L.Routing.control({
      waypoints: [origin, destination],
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      show: false,
      createMarker: (i, wp) =>
        L.marker(wp.latLng).bindPopup(
          i === 0 ? "Origin" : "Destination"
        ),
    })
      .on("routesfound", function (e) {
        const route = e.routes[0];
        const distanceKm = (route.summary.totalDistance / 1000).toFixed(2);
        const durationMin = Math.round(route.summary.totalTime / 60);

        console.log("Distance:", distanceKm, "km");
        console.log("Duration:", durationMin, "minutes");
      })
      .addTo(map);

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <div id="map" style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default RoutesMap;

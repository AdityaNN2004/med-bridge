import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapWithRadius = () => {
  useEffect(() => {
    const centerAddress = "Charminar, Hyderabad, India";

    const otherAddresses = [
      "Mehdipatnam, Hyderabad, India",
      "Banjara Hills, Hyderabad, India",
      "Secunderabad Railway Station, Hyderabad, India",
      "Shamshabad Airport, Hyderabad, India"
    ];

    const radiusInMeters = 15000; // 15 KM

    // 🟢 Green icon (center)
    const greenIcon = new L.Icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    // 🔵 Blue icon (other points)
    const blueIcon = new L.Icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const getLatLng = async (address) => {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );
      const data = await response.json();
      if (!data || data.length === 0) return null;

      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    };

    const loadMap = async () => {
      const centerLatLng = await getLatLng(centerAddress);
      if (!centerLatLng) {
        alert("Center address not found");
        return;
      }

      const map = L.map("map").setView(
        [centerLatLng.lat, centerLatLng.lng],
        12
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      // 🔴 Radius circle
      L.circle([centerLatLng.lat, centerLatLng.lng], {
        radius: radiusInMeters,
        color: "red",
        fillColor: "#ff0000",
        fillOpacity: 0.25,
      }).addTo(map);

      // 🟢 Center marker
      L.marker([centerLatLng.lat, centerLatLng.lng], {
        icon: greenIcon,
      })
        .addTo(map)
        .bindPopup(`Center: ${centerAddress}`)
        .openPopup();

      // 🔵 Other markers (inside radius only)
      for (const address of otherAddresses) {
        const point = await getLatLng(address);
        if (!point) continue;

        const distance = map.distance(
          [centerLatLng.lat, centerLatLng.lng],
          [point.lat, point.lng]
        );

        if (distance <= radiusInMeters) {
          L.marker([point.lat, point.lng], {
            icon: blueIcon,
          })
            .addTo(map)
            .bindPopup(`Inside radius: ${address}`);
        }
      }
    };

    loadMap();

    return () => {
      const mapElement = document.getElementById("map");
      if (mapElement) mapElement._leaflet_id = null;
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <div id="map" style={{ width: "100%", height: "100%" }}></div>
    </div>
  );
};

export default MapWithRadius;

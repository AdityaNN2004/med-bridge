import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapWithRadius = ({
  centerAddress = "Sitabuldi , Maharashtra, India",
  otherAddresses = [],
  radiusInMeters = 15000,
  height = "480px",

}) => {
  useEffect(() => {
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
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );
      const data = await res.json();
      if (!data?.length) return null;
      return { lat: +data[0].lat, lng: +data[0].lon };
    };

    const loadMap = async () => {
      const center = await getLatLng(centerAddress);
      if (!center) return;

      const map = L.map(`map-${centerAddress}`).setView(
        [center.lat, center.lng],
        12
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

      L.circle([center.lat, center.lng], {
        radius: radiusInMeters,
        color: "red",
        fillOpacity: 0.2,
      }).addTo(map);

      L.marker([center.lat, center.lng], { icon: greenIcon }).addTo(map);

      for (const addr of otherAddresses) {
        const point = await getLatLng(addr);
        if (!point) continue;

        const dist = map.distance(
          [center.lat, center.lng],
          [point.lat, point.lng]
        );

        if (dist <= radiusInMeters) {
          L.marker([point.lat, point.lng], { icon: blueIcon }).addTo(map);
        }
      }
    };

    loadMap();
  }, [centerAddress, otherAddresses, radiusInMeters]);

  return (
    <div
      id={`map-${centerAddress}`}
      style={{ width: "100%", height, borderRadius: "12px" }}
    />
  );
};

export default MapWithRadius;

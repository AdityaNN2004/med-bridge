import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { getServiceAreaOfNgo } from "../Services/NgoServices";
import { getEntityId } from "../utils/jwtUtils";

const MapWithRadius = ({ height = "100%" }) => {
  const [ngoData, setNgoData] = useState(null);
  const [radiusInMeters, setRadiusInMeters] = useState(10000);
  const mapRef = useRef(null);

  /* ===================== 1️⃣ LOAD NGO DATA ===================== */
  useEffect(() => {
    console.log("① MapWithRadius mounted");
    loadNgoServiceArea();
  }, []);

  const loadNgoServiceArea = async () => {
    try {
      console.log("② Fetching NGO service area...");
      const ngoId = getEntityId();
      console.log("③ NGO ID:", ngoId);

      const res = await getServiceAreaOfNgo(ngoId);
      console.log("④ API raw response:", res);

      const ngo = res.data;
      console.log("⑤ NGO data:", ngo);

      setNgoData(ngo);
      setRadiusInMeters((ngo.serviceRadius || 10) * 1000);
    } catch (err) {
      console.error("❌ Failed to load NGO service area", err);
    }
  };

  /* ===================== 2️⃣ GEOCODING WITH FALLBACK ===================== */
  const buildAddressCandidates = (ngo) => {
    const candidates = [];

    if (ngo.city && ngo.state && ngo.zipCode)
      candidates.push(`${ngo.city}, ${ngo.state} ${ngo.zipCode}`);

    if (ngo.city && ngo.zipCode)
      candidates.push(`${ngo.city}, ${ngo.zipCode}`);

    if (ngo.city)
      candidates.push(`${ngo.city}, India`);

    console.log("⑥ Address candidates:", candidates);
    return candidates;
  };

  const getLatLng = async (addresses) => {
    for (const address of addresses) {
      console.log("⑦ Trying geocode:", address);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );

      console.log("⑧ Nominatim status:", res.status);

      const data = await res.json();
      console.log("⑨ Nominatim data:", data);

      if (data?.length) {
        console.log("✅ Geocode SUCCESS:", address);
        return { lat: +data[0].lat, lng: +data[0].lon };
      }
    }

    console.error("❌ All geocoding attempts failed");
    return null;
  };

  /* ===================== 3️⃣ LOAD MAP ===================== */
  useEffect(() => {
    console.log("⑩ Map effect triggered");
    if (!ngoData) {
      console.warn("⚠ NGO data not ready");
      return;
    }

    const loadMap = async () => {
      console.log("⑪ loadMap() started");

      const center = await getLatLng(buildAddressCandidates(ngoData));
      console.log("⑫ Center lat/lng:", center);

      if (!center) {
        console.error("❌ Center is null, map will NOT render");
        return;
      }

      // 🔥 Destroy existing map
      if (mapRef.current) {
        console.log("⑬ Removing old map");
        mapRef.current.remove();
      }

      const container = document.getElementById("ngo-radius-map");
      console.log("⑭ Map container:", container);
      console.log("⑮ Container height:", container?.offsetHeight);

      mapRef.current = L.map("ngo-radius-map").setView(
        [center.lat, center.lng],
        12
      );

      console.log("⑯ Leaflet map created");

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(mapRef.current);

      console.log("⑰ Tile layer added");

      L.circle([center.lat, center.lng], {
        radius: radiusInMeters,
        color: "red",
        fillOpacity: 0.2,
      }).addTo(mapRef.current);

      console.log("⑱ Radius circle added");

      L.marker([center.lat, center.lng]).addTo(mapRef.current);
      console.log("⑲ Marker added");

      setTimeout(() => {
        console.log("⑳ invalidateSize()");
        mapRef.current.invalidateSize();
      }, 400);
    };

    loadMap();

    return () => {
      if (mapRef.current) {
        console.log("㉑ Cleanup: removing map");
        mapRef.current.remove();
      }
    };
  }, [ngoData, radiusInMeters]);

  console.log("㉒ Render JSX");

  return (
    <div
      id="ngo-radius-map"
      style={{
        width: "100%",
        height: "400px",
        borderRadius: "12px",
        background: "#f3f4f6", // debug visibility
      }}
    />
  );
};

export default MapWithRadius;

import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";

const RoutesMap = ({ originAddress, destinationAddress }) => {
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState(null);

  const { isLoaded } = useJsApiLoader({
    // googleMapsApiKey: "AIzaSyCz5BYROEEeoaccHJLX0agc13U_JE6jgbE",
  });

  useEffect(() => {
    if (!isLoaded || !originAddress || !destinationAddress) return;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: originAddress,
        destination: destinationAddress,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
          const meters = result.routes[0].legs[0].distance.value;
          setDistance((meters / 1000).toFixed(2) + " km");
        }
      }
    );
  }, [isLoaded, originAddress, destinationAddress]);

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="w-full h-full relative">
      {distance && (
        <div className="absolute top-4 right-4 z-10 bg-white shadow px-4 py-2 rounded-full text-sm font-semibold">
          Distance: {distance}
        </div>
      )}

      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={{ lat: 20.5937, lng: 78.9629 }} // fallback
        zoom={6}
      >
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </div>
  );
};

export default RoutesMap;
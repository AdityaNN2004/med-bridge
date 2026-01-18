import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 17.385044,
  lng: 78.486671,
};

const RoutesMap = () => {
  const [directions, setDirections] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCz5BYROEEeoaccHJLX0agc13U_JE6jgbE",
    libraries: ["places"],
  });

  useEffect(() => {
    if (!isLoaded) return; // 🔑 IMPORTANT

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: "123 Gandhi Nagar,Nagpur, Maharashtra 440013",
        destination: "5th Floor, IT Park Parsodi,Nagpur Maharashtra 440553 ",
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
        } else {
          console.error("Directions error:", status);
        }
      }
    );
  }, [isLoaded]);

  if (!isLoaded) return <p>Loading Map...</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={7}
    >
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  );
};

export default RoutesMap;

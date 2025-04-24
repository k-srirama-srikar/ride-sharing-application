import React from "react";
import { LoadScript } from "@react-google-maps/api";

const GoogleMapsWrapper = ({ children }) => {
  return (
    <LoadScript
      googleMapsApiKey="YOUR_API_KEY_HERE"
      libraries={["places"]}
    >
      {children}
    </LoadScript>
  );
};

export default GoogleMapsWrapper;

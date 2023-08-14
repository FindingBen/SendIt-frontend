import React from "react";
import useAxiosInstance from "./axiosInstance";

const TrackLink = ({ destinationUrl, trackingUrl }) => {

    const axiosInstance = useAxiosInstance()

  const handleClick = async () => {
    // Log the click event on your backend (via API call)
    try {
      const response = await axiosInstance.post("/api/track-click", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trackingUrl }),
      });

      if (response.ok) {
        // Redirect the user to the original destination URL
        window.location.href = destinationUrl;
      }
    } catch (error) {
      console.error("Error tracking click:", error);
    }
  };

  return <a href={trackingUrl} onClick={handleClick}>Click me</a>;
};

export default TrackLink;

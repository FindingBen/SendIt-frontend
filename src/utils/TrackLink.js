import React from "react";

const TrackLink = ({ destinationUrl, trackingUrl }) => {
  const handleClick = async () => {
    // Log the click event on your backend (via API call)
    try {
      const response = await fetch("/api/track-click", {
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

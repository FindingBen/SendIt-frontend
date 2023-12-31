import React from "react";

const featuresRestrictions = (params) => {
  if (!params) {
    // Handle the case when the params object is not provided
    // For example, return false or throw an error
    return false;
  }

  // Destructure parameters if the object is defined
  const { feature_type, package_value, data } = params;

  // Check if any of the required properties are undefined
  if (!feature_type || !package_value || !data) {
    // Handle the case when any of the required properties are missing
    // For example, return false or throw an error
    return false;
  }
  switch (feature_type) {
    case "createList":
      // Check if user can create a new list
      if (package_value === "Basic package" && data.length >= 3) {
        return false;
      }
      return true;

    case "scheduleMessage":
      if (package_value === "Basic package") {
        return false;
      }
      return true;

    // case "deleteAccount":
    //   // Check permissions for deleting account
    //   return true;

    // ...

    default:
      // Return true by default for unknown feature types
      return true;
  }
};

export default featuresRestrictions;

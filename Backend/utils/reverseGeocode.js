const axios = require("axios");

const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/reverse",
      {
        params: {
          lat: latitude,
          lon: longitude,
          format: "jsonv2",
          addressdetails: 1,
        },
        headers: {
          "User-Agent": "BoiPara/1.0 (contact@boipara.com)",
          Accept: "application/json",
        },
        timeout: 10000,
      }
    );

    const data = response.data;

    if (!data || !data.address) {
      return null;
    }

    const address = data.address;

    const area =
      address.suburb ||
      address.neighbourhood ||
      address.quarter ||
      address.residential ||
      address.hamlet ||
      address.village ||
      "";

    const city =
      address.city ||
      address.town ||
      address.municipality ||
      address.village ||
      "";

    const district =
      address.city_district ||
      address.state_district ||
      address.county ||
      "";

    return {
      area,
      city,
      district,
      state: address.state || "",
      country: address.country || "",
      postcode: address.postcode || "",
      address: data.display_name || "",
    };
  } catch (error) {
    if (error.response?.status === 429) {
      console.warn("Nominatim rate limit exceeded (429).");
    } else {
      console.error(
        "Reverse geocoding failed:",
        error.response?.data || error.message
      );
    }

    return null;
  }
};

module.exports = reverseGeocode;
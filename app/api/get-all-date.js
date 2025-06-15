// utils/api.js
import axios from "axios";

const API_URL = "https://mocki.io/v1/83a59298-0e39-48b5-9cab-772adb5507bc";

export const fetchDates = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching programs:", error);
    return [];
  }
};

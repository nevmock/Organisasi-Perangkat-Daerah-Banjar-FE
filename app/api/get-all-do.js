// utils/api.js
import axios from "axios";

const API_URL = "https://mocki.io/v1/d7abdce3-f548-4c2d-8433-455cedb3a695";

export const fetchDos = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching programs:", error);
    return [];
  }
};

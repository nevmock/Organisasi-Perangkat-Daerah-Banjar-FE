// utils/api.js
import axios from "axios";

const API_URL = "https://mocki.io/v1/06685856-c5a0-492b-8bb7-a34153497390";

export const fetchHows = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching programs:", error);
    return [];
  }
};

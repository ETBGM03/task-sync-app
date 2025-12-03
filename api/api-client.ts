import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_APP_API_URL_DOMAIN,
  headers: {
    "Content-Type": "application/json",
    withCredentials: false,
  },
});

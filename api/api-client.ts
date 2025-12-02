import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_APP_BASE_URL_API,
  headers: {
    "Content-Type": "application/json",
    withCredentials: false,
  },
});

import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const api = axios.create({
  backendUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

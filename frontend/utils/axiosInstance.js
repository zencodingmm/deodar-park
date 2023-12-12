import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:4000",
  // baseURL: "http://192.168.100.188:4000",
});

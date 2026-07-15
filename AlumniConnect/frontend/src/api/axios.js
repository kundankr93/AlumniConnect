import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL;

console.log(
  "API URL:",
  API_URL
);

const API = axios.create({
  baseURL: API_URL,

  headers: {
    "Content-Type":
      "application/json",
  },

  timeout: 60000,
});

API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        "token"
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    console.log(
      "Sending request to:",
      `${config.baseURL}${config.url}`
    );

    return config;
  },

  (error) => {
    return Promise.reject(
      error
    );
  }
);

export default API;
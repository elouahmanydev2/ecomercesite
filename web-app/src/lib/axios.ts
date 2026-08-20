import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 3000,
  headers: { "X-Custom-Header": "foobar" },
});

export default api;
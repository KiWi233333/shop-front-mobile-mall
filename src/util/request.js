import axios from "axios";
// axios 简单封装
const baseURL = "http://43.139.55.209:8081/api";
const request = axios.create({
  baseURL,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

export { request, baseURL };

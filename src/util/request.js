import axios from "axios";
// axios 简单封装
const request = axios.create({
  baseURL: "http://43.139.55.209:8081/api",
  timeout: 5000,
});

export default request;

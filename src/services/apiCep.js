import axios from "axios";

const apiCep = axios.create({
  baseURL: "https://viacep.com.br/ws",
  timeout: 2000,
  headers: {
    "Content-Type": "application/json",
  },
});

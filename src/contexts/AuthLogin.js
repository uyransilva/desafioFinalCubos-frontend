import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { getLocalItem } from "../utils/localStorage";

const apiCtx = createContext({});

export function AuthLogin({ children }) {
  const [token, setToken] = useState(getLocalItem("token"));
  const [users, setUsers] = useState();
  const navigate = useNavigate();

  async function login({ email, senha }) {
    const response = await api.post("/login", {
      email,
      senha,
    });
    const { usuario, token } = response.data;
    console.log(response.data);
  }
}

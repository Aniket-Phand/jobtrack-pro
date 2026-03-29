import axios from "axios";

const API = "http://localhost:8080/auth";

export const loginUser = async (data) => {
  const response = await axios.post(`${API}/login`, data);
  return response.data;
};
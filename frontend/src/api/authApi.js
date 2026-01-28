import api from "./axios";

// LOGIN
export const loginUser = (data) => {
  return api.post("/auth/login", data);
};

// REGISTER
export const registerUser = (data) => {
  return api.post("/auth/register", data);
};

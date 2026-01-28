import api from "./axios";

export const getMyProfile = () => {
  return api.get("/users/profile");
};

export const updateMyProfile = (data) => {
  return api.put("/users/profile", data);
};

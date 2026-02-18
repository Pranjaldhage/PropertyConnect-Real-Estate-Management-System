import api from "./axios";

/* =============================
        PROFILE
============================= */

export const getMyProfile = async () => {
  try {
    return await api.get("/users/profile", { timeout: 10000 });
  } catch (error) {
    console.error("API:getMyProfile:", error);
    throw error;
  }
};

export const updateMyProfile = async (data) => {
  try {
    return await api.put("/users/profile", data, {
      timeout: 10000,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API:updateMyProfile:", error);
    throw error;
  }
};

/* =============================
        ADDRESS
============================= */

export const addMyAddress = async (data) => {
  try {
    return await api.post("/users/address", data, {
      timeout: 10000,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API:addMyAddress:", error);
    throw error;
  }
};

export const getMyAddresses = async () => {
  try {
    return await api.get("/users/address", { timeout: 10000 });
  } catch (error) {
    console.error("API:getMyAddresses:", error);
    throw error;
  }
};

export const saveProfileFull = async (data) => {
  return api.post("/users/profile-full", data, {
    headers: { "Content-Type": "application/json" },
  });
};

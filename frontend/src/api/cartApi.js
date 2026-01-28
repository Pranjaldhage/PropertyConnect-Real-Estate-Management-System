import api from "./axios";

/* ==========================
   CART API
========================== */

export const getSavedProperties = () => {
  return api.get("/cart");
};

export const removeFromCart = (propertyId) => {
  return api.delete(`/cart/remove/${propertyId}`);
};

export const addToCart = (propertyId, price) => {
  return api.post("/cart/add", {
    propertyId: Number(propertyId),
    price: Number(price),
  });
};

import api from "./axios";

export const sendEnquiry = (data) =>
  api.post("/enquiries", data);

export const getMyEnquiries = (customerId) => {
  return api.get(`/enquiries/customer/${customerId}`);
};
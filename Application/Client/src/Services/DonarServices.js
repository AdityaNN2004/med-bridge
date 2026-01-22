import axios from "axios";

const BASE_URL = "http://localhost:9090/donar";

// ---------- DONOR ----------
export const getDonor = (userid) => {
  return axios.get(`${BASE_URL}/getdonardetails/${userid}`);
};

export const updateDonor = (donorId, payload) => {
  return axios.put(`${BASE_URL}/${donorId}`, payload);
};

// ---------- ADDRESS ----------
export const getAddresses = () => {
  return axios.get(`${BASE_URL}/addresses`);
};

export const updateAddress = (addressId, payload) => {
  return axios.put(`${BASE_URL}/address/${addressId}`, payload);
};

export const makeAddressActive = (addressId) => {
  return axios.put(`${BASE_URL}/makeaddressactive/${addressId}`);
};

export const ApproveNgo = (medicine_id, ngo_id) => {
  return axios.put(`${BASE_URL}/${medicine_id}/${ngo_id}/approve`);
};


export const RejectNgo = (medicine_id, ngo_id) => {
  return axios.put(`${BASE_URL}/${medicine_id}/${ngo_id}/reject`);
};

import axios from "axios";

const BASE_URL = "http://localhost:9090/donar";

/* ---------- UTILITY (204 → 0) ---------- */
const safeCount = async (apiCall) => {
  try {
    const response = await apiCall;
    return response.status === 204 ? 0 : response.data;
  } catch (error) {
    console.error("Count API failed", error);
    return 0;
  }
};

/* ---------- DONOR ---------- */
export const getDonor = (userid) => {
  return axios.get(`${BASE_URL}/getdonardetails/${userid}`);
};

export const updateDonor = (donorId, payload) => {
  return axios.put(`${BASE_URL}/${donorId}`, payload);
};

/* ---------- ADDRESS ---------- */
export const getAddresses = () => {
  return axios.get(`${BASE_URL}/addresses`);
};

export const updateAddress = (addressId, payload) => {
  return axios.put(`${BASE_URL}/address/${addressId}`, payload);
};

export const makeAddressActive = (addressId) => {
  return axios.put(`${BASE_URL}/makeaddressactive/${addressId}`);
};

/* ---------- NGO ACTIONS ---------- */
export const ApproveNgo = (medicine_id, ngo_id) => {
  return axios.put(`${BASE_URL}/${medicine_id}/${ngo_id}/approve`);
};

export const RejectNgo = (medicine_id, ngo_id) => {
  return axios.put(`${BASE_URL}/${medicine_id}/${ngo_id}/reject`);
};

export const getNgoDetailsForARequestedMedicineByMedicineIdApprovedByDonar = (
  medicine_id
) => {
  return axios.get(
    `${BASE_URL}/getngodetailsfoarequestedmedicinebyMedicineidapprovedbydonar/${medicine_id}`
  );
};

/* ---------- MEDICINE COUNTS (FIXED FOR 204) ---------- */
export const getAllMedicinesCount = async (donar_id) =>
  safeCount(
    axios.get(`${BASE_URL}/getAllMedicinesCount/${donar_id}`)
  );

export const getListedMedicinesCount = async (donar_id) =>
  safeCount(
    axios.get(`${BASE_URL}/getListedMedicinesCount/${donar_id}`)
  );

export const getUnListedMedicinesCount = async (donar_id) =>
  safeCount(
    axios.get(`${BASE_URL}/getUnListedMedicinesCount/${donar_id}`)
  );

export const getExpiredMedicinesCount = async (donar_id) =>
  safeCount(
    axios.get(`${BASE_URL}/getExpiredMedicinesCount/${donar_id}`)
  );

export const getExpiringSoonMedicinesCount = async (donar_id) =>
  safeCount(
    axios.get(`${BASE_URL}/getExpiringSoonMedicinesCount/${donar_id}`)
  );


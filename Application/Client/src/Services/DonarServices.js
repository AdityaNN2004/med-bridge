import axios from "axios";

const BASE_URL = "http://localhost:9090/donar";

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


export const getDonarAddress = (donarId) => {
  return axios.get(`${BASE_URL}/getactiveaddress/${donarId}`);
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

/* ---------- MEDICINE COUNTS (SERVER 11.0) ---------- */
export async function getAllMedicinesCount(donar_id) {
  const url = `${BASE_URL}/getAllMedicinesCount/${donar_id}`;
  const response = await axios.get(url);
  return response.data;
}

export async function getListedMedicinesCount(donar_id) {
  const url = `${BASE_URL}/getListedMedicinesCount/${donar_id}`;
  const response = await axios.get(url);
  return response.data;
}

export async function getUnListedMedicinesCount(donar_id) {
  const url = `${BASE_URL}/getUnListedMedicinesCount/${donar_id}`;
  const response = await axios.get(url);
  return response.data;
}

export async function getExpiredMedicinesCount(donar_id) {
  const url = `${BASE_URL}/getExpiredMedicinesCount/${donar_id}`;
  const response = await axios.get(url);
  return response.data;
}

export async function getExpiringSoonMedicinesCount(donar_id) {
  const url = `${BASE_URL}/getExpiringSoonMedicinesCount/${donar_id}`;
  const response = await axios.get(url);
  return response.data;
}

export async function getCompletedDonations(donar_id) {
  const url = `${BASE_URL}/completeddonations/${donar_id}`;
  const response = await axios.get(url);
  return response.data;
}

export async function getpendingRequests(donar_id) {
  const url = `${BASE_URL}/requestedMedicines/${donar_id}`;
  const response = await axios.get(url);
  return response.data;
}

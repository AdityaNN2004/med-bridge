import axiosInstance from "../utils/axiosInstance ";
const BASE_URL = "/donar";

/* ---------- DONOR ---------- */
export const getDonor = (userid) =>
  axiosInstance.get(`${BASE_URL}/getdonardetails/${userid}`);

export const updateDonor = (donorId, payload) =>
  axiosInstance.put(`${BASE_URL}/${donorId}`, payload);

/* ---------- ADDRESS ---------- */
export const getAddresses = (donarId) =>
  axiosInstance.get(`${BASE_URL}/addresses/${donarId}`);

export const updateAddress = (addressId, payload) =>
  axiosInstance.put(`${BASE_URL}/address/${addressId}`, payload);

export const getDonarAddress = (donarId) =>
  axiosInstance.get(`${BASE_URL}/getactiveaddress/${donarId}`);

export const makeAddressActive = (addressId) =>
  axiosInstance.put(`${BASE_URL}/makeaddressactive/${addressId}`);

/* ---------- NGO ACTIONS ---------- */
export const ApproveNgo = (medicine_id, ngo_id) =>
  axiosInstance.put(`${BASE_URL}/${medicine_id}/${ngo_id}/approve`);

export const RejectNgo = (medicine_id, ngo_id) =>
  axiosInstance.put(`${BASE_URL}/${medicine_id}/${ngo_id}/reject`);

export const getNgoDetailsForARequestedMedicineByMedicineIdApprovedByDonar = (
  medicine_id
) =>
  axiosInstance.get(
    `${BASE_URL}/getngodetailsfoarequestedmedicinebyMedicineidapprovedbydonar/${medicine_id}`
  );

/* ---------- COUNTS ---------- */
export const getAllMedicinesCount = async (donar_id) =>
  (await axiosInstance.get(`${BASE_URL}/getAllMedicinesCount/${donar_id}`)).data;

export const getListedMedicinesCount = async (donar_id) =>
  (await axiosInstance.get(`${BASE_URL}/getListedMedicinesCount/${donar_id}`)).data;

export const getUnListedMedicinesCount = async (donar_id) =>
  (await axiosInstance.get(`${BASE_URL}/getUnListedMedicinesCount/${donar_id}`)).data;

export const getExpiredMedicinesCount = async (donar_id) =>
  (await axiosInstance.get(`${BASE_URL}/getExpiredMedicinesCount/${donar_id}`)).data;

export const getExpiringSoonMedicinesCount = async (donar_id) =>
  (await axiosInstance.get(`${BASE_URL}/getExpiringSoonMedicinesCount/${donar_id}`)).data;

export const getCompletedDonations = async (donar_id) =>
  (await axiosInstance.get(`${BASE_URL}/completeddonations/${donar_id}`)).data;

export const getpendingRequests = async (donar_id) =>
  (await axiosInstance.get(`${BASE_URL}/requestedMedicines/${donar_id}`)).data;

/* ---------- ADD ADDRESS ---------- */
export const addAddress = (payload) =>
  axiosInstance.post(`${BASE_URL}/addaddress`, payload);


export const getDonationDtoByMedicineId = async (med_id) =>
  (await axiosInstance.get(`${BASE_URL}/getdonationsinfobymedicineid/${med_id}`)).data;

export const markRequestAsCompleted = (medicineId) => {
  return axiosInstance.put(`${BASE_URL}/markRequestAsCompleted/${medicineId}`);
};

export const markRequestAsDiscarded = (medicineId) => {
  return axiosInstance.put(`${BASE_URL}/markRequestAsDiscarded/${medicineId}`);
};
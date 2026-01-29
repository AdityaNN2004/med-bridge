import axiosInstance from "../utils/axiosInstance ";
const BASE_URL = "/ngo";

// export const addToNgoPending = () =>
//   axiosInstance.get(`${BASE_URL}/c/1`);

export const getListMedicinesInServiceRadius = (ngoid) =>
  axiosInstance.get(`${BASE_URL}/getlistmedicinesinserviceradius/${ngoid}`);

export const RequestMedicine = (body) =>
  axiosInstance.post(`${BASE_URL}/addToViewStatusNgo`, body);

export const FindOnGoingRequestMedicines = (ngoid) =>
  axiosInstance.get(`${BASE_URL}/findongoingrequestmedicines/${ngoid}`);

export const FindRejectedRequestMedicines = (ngoid) =>
  axiosInstance.get(`${BASE_URL}/findrejectedrequestmedicines/${ngoid}`);

export const FindPendingRequestMedicinesByNgoId = (ngoid) =>
  axiosInstance.get(`${BASE_URL}/findpendingrequestmedicinesbyngoid/${ngoid}`);

export const getAllDonatedMedicinesByNgoId = (ngoid) =>
  axiosInstance.get(`${BASE_URL}/getalldonatedmedicinesbyngoid/${ngoid}`);

export const getDonorWithAddressByNgoAndMedicineNative = (ngoid, medicine_id) =>
  axiosInstance.get(
    `${BASE_URL}/getdonorwithaddressbyngoandmedicinenative/${ngoid}/${medicine_id}`
  );

export const getServiceAreaOfNgo = (ngoid) =>
  axiosInstance.get(`${BASE_URL}/getserviceareaofngo/${ngoid}`);

export const updateServiceArea = (ngo_id, service_radius) =>
  axiosInstance.put(`${BASE_URL}/updateServiceArea/${ngo_id}` , service_radius);

export const getNgoDetails = (ngoId) =>
  axiosInstance.get(`${BASE_URL}/getNgoDetails/${ngoId}`);

export const getServiceArea = (ngoId) =>
  axiosInstance.get(`${BASE_URL}/getServiceArea/${ngoId}`);

export const getMedicineDetails = (medicine_id) =>
  axiosInstance.get(`${BASE_URL}/getmedicinedetails/${medicine_id}`);
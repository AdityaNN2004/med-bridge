import axios from 'axios';
const BASE_URL = 'http://localhost:9090/ngo';

export const addToNgoPending = () =>
{
   return axios.get(`${BASE_URL}/c/1`);
}

export const getListMedicinesInServiceRadius = (ngoid) =>
{
   return axios.get(`${BASE_URL}/getlistmedicinesinserviceradius/${ngoid}`);
}

export const RequestMedicine = (body) => {
  return axios.post(`${BASE_URL}/addToViewStatusNgo`, body);
};

export const FindOnGoingRequestMedicines = (ngoid) => {
  return axios.get(`${BASE_URL}/findongoingrequestmedicines/${ngoid}`);
};
export const FindRejectedRequestMedicines = (ngoid) => {
  return axios.get(`${BASE_URL}/findrejectedrequestmedicines/${ngoid}`);
};

export const FindPendingRequestMedicinesByNgoId = (ngoid) => {
  return axios.get(`${BASE_URL}/findpendingrequestmedicinesbyngoid/${ngoid}`);
};

export const getAllDonatedMedicinesByNgoId = (ngoid) => {
  return axios.get(`${BASE_URL}/getalldonatedmedicinesbyngoid/${ngoid}`);
};

export const getDonorWithAddressByNgoAndMedicineNative = (ngoid, medicine_id) => {
  return axios.get(`${BASE_URL}/getdonorwithaddressbyngoandmedicinenative/${ngoid}/${medicine_id}`);
};

export const getServiceAreaOfNgo = (ngoid) => {
  return axios.get(`${BASE_URL}/getserviceareaofngo/${ngoid}`);
};

export const updateServiceArea = (ngoId, payload) => {
  return axios.put(
    `${BASE_URL}/updateServiceArea/${ngoId}`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const getNgoDetails = (ngoId) => {
  return axios.get(`${BASE_URL}/getNgoDetails/${ngoId}`);
};

export const getServiceArea = (ngoId) => {
  return axios.get(`${BASE_URL}/getServiceArea/${ngoId}`);
};
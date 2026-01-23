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


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
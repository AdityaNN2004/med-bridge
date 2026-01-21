import axios from 'axios';
const BASE_URL = 'http://localhost:9090/donar';


export const getAllMedicines = () =>
{
   return axios.get(`${BASE_URL}/getallmedicines/1`);
}

export const getAllUnListedMedicines = () =>
{
   return axios.get(`${BASE_URL}/getunlistedmedicines/1`);
}

export const getAllListedMedicines = () =>
{
   return axios.get(`${BASE_URL}/getlistedmedicines/1`);
}

export const getExpiredMedicines = () =>
{
   return axios.get(`${BASE_URL}/getlistedmedicines/1`);
}

export const getCloseToExpiredMedicines = () =>
{
   return axios.get(`${BASE_URL}/getlistedmedicines/1`);
}

export const getActiveMedicines = () =>
{
   return axios.get(`${BASE_URL}/getlistedmedicines/1`);
}

export const getMedicineDetails = (medicine_id) =>
{
   return axios.get(`${BASE_URL}/getmedicinedetails/${medicine_id}`);
}

export const changelistingstatusmedicine = (medicne_id) =>
{
   return axios.get(`${BASE_URL}/changelistingstatusmedicine/${medicne_id}`);
}


export const addMedicine = ( medicineName,  expiry_date,  quantity, medicineImage,  medicinecategory) => {
   const body =
   {
       medicineName,  expiry_date,  quantity, medicineImage,  medicinecategory
   }
  return axios.post(`${BASE_URL}/addmedicine/${1}`, body, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

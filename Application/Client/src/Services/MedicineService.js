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

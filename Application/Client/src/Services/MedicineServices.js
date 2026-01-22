import axios from 'axios';
const BASE_URL = 'http://localhost:9090/donar';


export const getAllMedicines = () =>
{
   return axios.get("http://localhost:9090/donar/getallmedicines/1");
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
   return axios.get(`${BASE_URL}/getexpiredmedicines/1`);
}

export const getCloseToExpiredMedicines = () =>
{
   return axios.get(`${BASE_URL}/getclosetoexpiredmedicines/1`);
}

export const getActiveMedicines = () =>
{
   return axios.get(`${BASE_URL}/getactivemedicines/1`);
}

export const getMedicineDetails = (medicine_id) =>
{
   return axios.get(`${BASE_URL}/getmedicinedetails/${medicine_id}`);
}

export const deleteMedicine = (medicine_id) =>
{
   return axios.get(`${BASE_URL}/deletemedicine/${medicine_id}`);
}


export const ChangeListingStatusToListed = (medicne_id) =>
{
   return axios.get(`${BASE_URL}/changelistingstatustoislistedmedicine/${medicne_id}`);
}
export const ChangeListingStatusNotListed = (medicne_id) =>
{
   return axios.get(`${BASE_URL}/changelistingstatustonotlisted/${medicne_id}`);
}

export const getRequestedNgosForMedicine = (medicineId) => {
  return axios.get(`${BASE_URL}/getrequestedngosformedicine/${medicineId}`);
};

export const isMedicineDonationInProgress = (medicine_id) => {
  return axios.get(`${BASE_URL}/ismedicinedonationinprogress/${medicine_id}`);
};


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

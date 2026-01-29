import axiosInstance from "../utils/axiosInstance ";

const BASE_URL = "/donar";

export const getAllMedicines = (donar_id) =>
  axiosInstance.get(`${BASE_URL}/getallmedicines/${donar_id}`);

export const getAllUnListedMedicines = (donar_id) =>
  axiosInstance.get(`${BASE_URL}/getunlistedmedicines/${donar_id}`);

export const getAllListedMedicines = (donar_id) =>
  axiosInstance.get(`${BASE_URL}/getlistedmedicines/${donar_id}`);

export const getExpiredMedicines = (donar_id) =>
  axiosInstance.get(`${BASE_URL}/getexpiredmedicines/${donar_id}`);

export const getCloseToExpiredMedicines = (donar_id) =>
  axiosInstance.get(`${BASE_URL}/getclosetoexpiredmedicines/${donar_id}`);

export const getActiveMedicines = (donar_id) =>
  axiosInstance.get(`${BASE_URL}/getactivemedicines/${donar_id}`);

export const getMedicineDetails = (medicine_id) =>
  axiosInstance.get(`${BASE_URL}/getmedicinedetails/${medicine_id}`);

export const deleteMedicine = (medicine_id) =>
  axiosInstance.get(`${BASE_URL}/deletemedicine/${medicine_id}`);

export const ChangeListingStatusToListed = (medicine_id) =>
  axiosInstance.get(`${BASE_URL}/changelistingstatustoislistedmedicine/${medicine_id}`);

export const ChangeListingStatusNotListed = (medicine_id) =>
  axiosInstance.get(`${BASE_URL}/changelistingstatustonotlisted/${medicine_id}`);

export const getRequestedNgosForMedicine = (medicineId) =>
  axiosInstance.get(`${BASE_URL}/getrequestedngosformedicine/${medicineId}`);

export const isMedicineDonationInProgress = (medicine_id) =>
  axiosInstance.get(`${BASE_URL}/ismedicinedonationinprogress/${medicine_id}`);

export const addMedicine = (formData, donar_id) => {
  return axiosInstance.post(
    `/donar/addmedicine/${donar_id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};


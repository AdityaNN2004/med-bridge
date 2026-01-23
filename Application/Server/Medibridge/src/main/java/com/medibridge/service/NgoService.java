package com.medibridge.service;

import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.medibridge.dtos.ApiResponse;
import com.medibridge.dtos.DonorWithAddressDto;
import com.medibridge.dtos.ListedMedicineInAreaDto;
import com.medibridge.dtos.MedicineCategoryPercentageDto;
import com.medibridge.dtos.MedicineDto;
import com.medibridge.dtos.ServiceAreaDto;
import com.medibridge.dtos.ViewStatusDtoDonarId;
import com.medibridge.entities.donar.Medicine;
import com.medibridge.entities.ngo.Ngo;
import com.medibridge.entities.ngo.ServiceArea;
@Service
public interface NgoService {

    List<Medicine> getAllListedMedicines();
    
    
    ApiResponse addToViewStatusNgo(ViewStatusDtoDonarId viewstatusdto);

	Ngo registerNGO(Ngo ngo);

	void uploadDocuments(Long ngoId, MultipartFile registrationCert, MultipartFile taxCert, MultipartFile idProof) throws IOException;

	void saveServiceArea(Long ngoId, ServiceArea serviceArea);
    
	ServiceAreaDto getServiceAreaOfNgo(Long Ngo_id);
	
	List<ListedMedicineInAreaDto> getListMedicinesInServiceRadius(Long Ngo_id);
	
	List<ListedMedicineInAreaDto> findPendingRequestMedicinesByNgoId(Long Ngo_id);
	
	List<ListedMedicineInAreaDto> findRejectedRequestMedicines(Long Ngo_id);
	
	List<ListedMedicineInAreaDto> findOnGoingRequestMedicines(Long Ngo_id);
	
	List<MedicineDto>  getAllDonatedMedicinesByNgoId(Long Ngo_id);

	List<MedicineCategoryPercentageDto> getMedicineCategoryByPercentage(Long ngo_id);
	
	ApiResponse changeDonationStatusNgoToDonationProcessStarted(Long medicineId, Long ngoId);
    
	ApiResponse changeDonationStatusNgoToDonationProcessNotStarted(Long medicineId, Long ngoId);
  
	DonorWithAddressDto getDonorWithAddressByNgoAndMedicineNative( Long ngoId, Long medicineId);
	
}

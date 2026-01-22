package com.medibridge.service;

import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.medibridge.dtos.ApiResponse;
import com.medibridge.dtos.ListedMedicineInAreaDto;
import com.medibridge.dtos.MedicineDto;
import com.medibridge.dtos.ServiceAreaDto;
import com.medibridge.dtos.ViewStatusDto;
import com.medibridge.entities.donar.Medicine;
import com.medibridge.entities.ngo.Ngo;
import com.medibridge.entities.ngo.ServiceArea;
@Service
public interface NgoService {

    List<Medicine> getAllListedMedicines();
    
    ApiResponse changeDonarApprovalToApproved(Long donar_id);
    
    ApiResponse changeDonarApprovalToNotApproved(Long donar_id);
    
    ApiResponse changeDonationStatusNgoToDonationProcessStarted(Long medicineId, Long ngoId);
    
    ApiResponse changeDonationStatusNgoToDonationProcessNotStarted(Long medicineId, Long ngoId);
    
    ApiResponse addToViewStatusNgo(ViewStatusDto viewstatusdto);

	Ngo registerNGO(Ngo ngo);

	void uploadDocuments(Long ngoId, MultipartFile registrationCert, MultipartFile taxCert, MultipartFile idProof) throws IOException;

	void saveServiceArea(Long ngoId, ServiceArea serviceArea);
    
	ServiceAreaDto getServiceAreaOfNgo(Long Ngo_id);
	
	List<ListedMedicineInAreaDto> getListMedicinesInServiceRadius(Long Ngo_id);
	
}

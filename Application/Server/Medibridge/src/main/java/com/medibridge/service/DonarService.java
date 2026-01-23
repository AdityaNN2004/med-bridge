package com.medibridge.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.medibridge.dtos.MedicineDto;
import com.medibridge.dtos.NgoWithServiceAreaDto;
import com.medibridge.dtos.RequestedNgos;
import com.medibridge.dtos.AddressDto;
import com.medibridge.dtos.ApiResponse;
import com.medibridge.dtos.DonarDashboardDto;
import com.medibridge.dtos.DonarDto;
import com.medibridge.dtos.MedicineCategoryPercentageDto;
import com.medibridge.entities.User;
import com.medibridge.*;
import com.medibridge.entities.donar.Address;
import com.medibridge.entities.donar.Donar;
import com.medibridge.entities.donar.Medicine;
import com.medibridge.entities.donar.MedicineCategory;
import com.medibridge.entities.ngo.Ngo;
@Service
public interface DonarService {
		    
		String signUp(Donar donar);
		
		Donar getDonarDetails(Long donar_id);
		
		String changePassword(String email, String oldPassword, String newPassword);
		
		Donar signIn(String email, String password);
		
		String deleteDonarDetails(Long donar_id);
		
		ApiResponse addMedicine(MedicineDto medicinedto);
		
		MedicineDto getMedicineDetails(Long medicne_id);	
		
		ApiResponse deleteMedicine(Long medicne_id);	
		
		List<MedicineDto> getAllMedicines(Long doanr_id);
		
		List<MedicineDto> getExpiredMedicines(Long donar_id);
		
		List<MedicineDto> getCloseToExpiryMedicine(Long donar_id);
	
		List<MedicineDto> getActiveMedicine(Long donar_id);
	    
		List<Address> getAllDonarAddress(Long donar_id);
		
		ApiResponse updateDonarDetails(Long user_id, DonarDto donar);
		
		ApiResponse ListMedicine(Long medicine_id);
		
		List<MedicineDto> getUnListedMedicine(Long donar_id);
		
		List<MedicineDto> getListedMedicine(Long donar_id);
		
		ApiResponse ChangeListingStatusNotListed(Long medicine_id);
		
		ApiResponse ChangeListingStatusToisListed(Long medicine_id);
		
		DonarDashboardDto donardashboardstats();
		
		List<MedicineCategoryPercentageDto> getMedicineCategoryPercentageByDonar(Long donarId);
		
		AddressDto getActiveDonarAddress(Long donar_id);
		
		List<AddressDto> getListOfActiveAddress();
		
		void switchAddress(Long address_id);
		
		List<RequestedNgos> getRequestedNgoByMedicineid(Long medicine_id);
		
		int getMedicineCount(Long donar_id);

		int getListedMedicineCount(Long donar_id);

		int getUnListedMedicineCount(Long donar_id);

		int getExpiredMedicineCount(Long donar_id);

		int getExpiringSoonMedicineCount(Long donar_id);
		
		 ApiResponse changeDonarApprovalToApproved(Long medicine_id , Long ngo_id);
		    
		 ApiResponse changeDonarApprovalToNotApproved(Long medicine_id , Long ngo_id);
		
		 Long isMedicineDonationInProgress(Long medicine_id);
		 
		 NgoWithServiceAreaDto getNgoDetailsForARequestedMedicineByMedicineIdApprovedByDonar(Long medicine_id);

		int completedDonations(Long donar_id);

		int requestedMedicinesCount(Long donar_id);

}

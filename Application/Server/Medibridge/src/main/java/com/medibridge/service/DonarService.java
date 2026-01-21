package com.medibridge.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.medibridge.dtos.MedicineDto;
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
		
		ApiResponse ChangeListingStatusOfMedicine(Long donar_id);
		
		DonarDashboardDto donardashboardstats();
		
		List<MedicineCategoryPercentageDto> getMedicineCategoryPercentageByDonar(Long donarId);
}

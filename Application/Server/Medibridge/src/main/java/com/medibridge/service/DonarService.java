package com.medibridge.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.medibridge.dtos.MedicineDto;
import com.medibridge.dtos.ApiResponse;
import com.medibridge.dtos.DonarDto;
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
		
		List<MedicineDto> getAllMedicines(Long doanr_id);
		
		List<Medicine> getExpiredMedicine(Long donar_id);
		
		List<Medicine> getCloseToExpiryMedicine(Long donar_id);
	    
		List<Address> getAllDonarAddress(Long donar_id);
		
		ApiResponse updateDonarDetails(Long user_id, DonarDto donar);
		
}

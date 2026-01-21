package com.medibridge.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

import com.medibridge.custom_exceptions.ApiException;
import com.medibridge.custom_exceptions.ResourceNotFoundException;
import com.medibridge.dtos.MedicineDto;
import com.medibridge.dtos.AddressDto;
import com.medibridge.dtos.ApiResponse;
import com.medibridge.dtos.DonarDashboardDto;
import com.medibridge.dtos.DonarDto;
import com.medibridge.dtos.MedicineCategoryPercentageDto;
import com.medibridge.entities.User;
import com.medibridge.entities.donar.Address;
import com.medibridge.entities.donar.Donar;
import com.medibridge.entities.donar.ListingStatus;
import com.medibridge.entities.donar.Medicine;
import com.medibridge.entities.donar.MedicineCategory;
import com.medibridge.repository.DonarAddressRepository;
import com.medibridge.repository.DonarRepository;
import com.medibridge.repository.MedicineRepository;
@Service
@Transactional
public class DonarServiceImpl implements DonarService{
   
    @Autowired
	private MedicineRepository medicineRepository ;
    @Autowired
    private DonarRepository donarRepository;
    @Autowired
    private DonarAddressRepository donarAddressRepository;
    @Autowired
    private  PasswordEncoder passwordEncoder;
    @Autowired
    private ModelMapper modelMapper;
	@Override
	public String signUp(Donar donar) {
		donar.getUser().setPassword(passwordEncoder.encode(
				  donar.getUser().getPassword()));
		donarRepository.save(donar);
		return null;
	}

	@Override
	public Donar getDonarDetails(Long user_id) {
		return donarRepository.findByUser_Id(user_id).orElseThrow(() -> new ResourceNotFoundException("Invalid user id !!!"));
	}

	@Override
	public String changePassword(String email, String oldPassword, String newPassword) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Donar signIn(String email, String password) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String deleteDonarDetails(Long donar_id) {
		// TODO Auto-generated method stub
		try {
			Donar donar=donarRepository.findById(donar_id).orElseThrow(()->new ResourceNotFoundException("Invalid donar_id"));
			   donar.getUser().setActive(false);
				return "Deleted Donar Succesfully";
		}
		catch(Exception e) {
			return "Unable to Delete Donar";
		}
	
	}


	@Override
	public List<MedicineDto> getAllMedicines(Long donar_id) {
	   	List<Medicine> medicineList= medicineRepository.findByDonarId(donar_id);
		List<MedicineDto> medicineDtoList  = new ArrayList<>();
		
		for(Medicine medicine : medicineList)
		{
			medicineDtoList.add(modelMapper.map(medicine, MedicineDto.class));
		}
		
	
		 return medicineDtoList;
	}


	@Override
	public ApiResponse addMedicine(MedicineDto medicinedto) {
		
        	
		if(medicineRepository.existsBymedicineName(medicinedto.getMedicineName()))
		{
			throw new ApiException("medicine already exists!!!!!!!");
		}
		Donar donar = donarRepository.getById(medicinedto.getDonarid());		
		Medicine medicine = new Medicine();
		medicine.setDonar(donar);
		medicine.setExpiry_date(medicinedto.getExpiry_date());
		medicine.setMedicinecategory(medicinedto.getMedicinecategory());
		medicine.setMedicineName(medicinedto.getMedicineName());
		medicine.setMedicineImage(medicinedto.getMedicineImage());
		medicine.setListingStatus(ListingStatus.NotListed);
		Medicine medicineSave = medicineRepository.save(medicine);
		return new ApiResponse("New medicne added with ID=" + medicineSave.getId(), "Success");
	}

	@Override
	public List<Address> getAllDonarAddress(Long donar_id) {
		 return donarAddressRepository.findAll();
		 }

	@Override
	public ApiResponse updateDonarDetails(Long user_id, DonarDto dto) {
		Donar donarDetails = getDonarDetails(user_id);
		
		donarDetails.setFirstName(dto.getFirstName());
		donarDetails.setLastName(dto.getLastName());
		donarDetails.getUser().setEmail(dto.getEmail());
		donarDetails.getUser().setMobile(dto.getMobile());
		donarRepository.save(donarDetails);
		return new ApiResponse("User details updated ...", "Succeess");
	}

	@Override
	public ApiResponse ListMedicine(Long medicine_id) {
		Medicine medicine =  medicineRepository.getById(medicine_id);
		medicine.setListingStatus(ListingStatus.IsListed);
		medicineRepository.save(medicine);
		return new ApiResponse("Medicine Listed !!", "Succeess");
		
	}

	@Override
	public List<MedicineDto> getUnListedMedicine(Long donar_id) {
		
	 	List<Medicine> medicineList= medicineRepository.findUnlistedMedicinesByDonar(donar_id);
		List<MedicineDto> medicineDtoList  = new ArrayList<>();
			
		for(Medicine medicine : medicineList)
		{
			medicineDtoList.add(modelMapper.map(medicine, MedicineDto.class));
		}
			
		return medicineDtoList;
	}

	@Override
	public List<MedicineDto> getListedMedicine(Long donar_id) {
		List<Medicine> medicineList= medicineRepository.findlistedMedicinesByDonar(donar_id);
		List<MedicineDto> medicineDtoList  = new ArrayList<>();
			
		for(Medicine medicine : medicineList)
		{
			medicineDtoList.add(modelMapper.map(medicine, MedicineDto.class));
		}
			
		return medicineDtoList;
	}

	@Override
	public List<MedicineDto> getExpiredMedicines(Long donar_id) {
		List<Medicine> medicineList= medicineRepository.findExpiredMedicines(donar_id);
		List<MedicineDto> medicineDtoList  = new ArrayList<>();
			
		for(Medicine medicine : medicineList)
		{
			medicineDtoList.add(modelMapper.map(medicine, MedicineDto.class));
		}
			
		return medicineDtoList;
	}

	LocalDate today = LocalDate.now();
	LocalDate threeMonthsLater = today.plusMonths(3);
	@Override
	public List<MedicineDto> getCloseToExpiryMedicine(Long donar_id) {
		
		List<Medicine> medicines = medicineRepository.findMedicinesExpiringSoon(donar_id,today, threeMonthsLater);
	           
		return medicines.stream().map(medicine -> modelMapper.map(medicine, MedicineDto.class)).toList();
              
	}


	@Override
	public List<MedicineDto> getActiveMedicine(Long donar_id) {
		List<Medicine> medicineList= medicineRepository.findActiveMedicines(donar_id);
		List<MedicineDto> medicineDtoList  = new ArrayList<>();
			
		for(Medicine medicine : medicineList)
		{
			medicineDtoList.add(modelMapper.map(medicine, MedicineDto.class));
		}
			
		return medicineDtoList;
	}

	@Override
	public ApiResponse ChangeListingStatusOfMedicine(Long medicine_id) {
		Medicine medicine =  medicineRepository.getById(medicine_id);
		if(medicine.getListingStatus() == ListingStatus.NotListed)
		{
			medicine.setListingStatus(ListingStatus.IsListed);
		}
		else
		{
			medicine.setListingStatus(ListingStatus.NotListed);
		}		
		medicineRepository.save(medicine);
		return  new ApiResponse("Medicine ListingStatus Changed", "Success");
	}

	@Override
	public MedicineDto getMedicineDetails(Long medicine_id) {
		Medicine medicine =  medicineRepository.getById(medicine_id);
		MedicineDto medicinedto = modelMapper.map(medicine, MedicineDto.class); 
		return medicinedto;
	}

	@Override
	public ApiResponse deleteMedicine(Long medicine_id) {
		Medicine medicine =  medicineRepository.getById(medicine_id);
	    medicineRepository.delete(medicine);
	    return  new ApiResponse("Medicine deleted", "Success");
	}

	@Override
	public DonarDashboardDto donardashboardstats() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<MedicineCategoryPercentageDto> getMedicineCategoryPercentageByDonar(Long donarId) {
		
	    Long totalMedicines =  medicineRepository.countByDonar_Id(donarId);
        
	    if (totalMedicines == 0) {
	        return List.of();
	     }

	    List<Object[]> results =  medicineRepository.countMedicinesByCategoryForDonar(donarId);
	          
	    return results.stream().map(row -> {  
	                String category = row[0].toString();
	                Long count = (Long) row[1];
	                double percentage =  (count * 100.0) / totalMedicines;
                    return new MedicineCategoryPercentageDto( category, Math.round(percentage * 100.0) / 100.0);
	                 }) .toList();
	           
	}

	@Override
	public AddressDto getActiveDonarAddress(Long donar_id) {
	   Address address = donarRepository.findActiveAddressByDonarId(donar_id);
	   AddressDto addressdto = modelMapper.map(address, AddressDto.class);
	   System.out.println(addressdto);
	   return addressdto;
	}

	@Override
	public void switchAddress(Long address_id) {
		//public void switchAddress(Long address_id, Long donar_id) {
		//int inactive=donarRepository.inActiveAddress(donar_id);
		int inactive=donarRepository.inActiveAddress();
		
	    int active=donarRepository.setActiveAddress(address_id);
	
	    if (active == 0) {
            throw new RuntimeException("Address not found or not activated");
        }
	}


}

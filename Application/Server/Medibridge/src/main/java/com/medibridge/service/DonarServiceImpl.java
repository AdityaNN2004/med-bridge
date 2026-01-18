package com.medibridge.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

import com.medibridge.custom_exceptions.ApiException;
import com.medibridge.custom_exceptions.ResourceNotFoundException;
import com.medibridge.dtos.MedicineDto;
import com.medibridge.dtos.ApiResponse;
import com.medibridge.dtos.DonarDto;
import com.medibridge.entities.User;
import com.medibridge.entities.donar.Address;
import com.medibridge.entities.donar.Donar;
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
		return null;
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
	public List<Medicine> getExpiredMedicine(Long donar_id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Medicine> getCloseToExpiryMedicine(Long donar_id) {
		// TODO Auto-generated method stub
		return null;
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

}

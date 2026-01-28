package com.medibridge.service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.transaction.Transactional;

import com.medibridge.custom_exceptions.ApiException;
import com.medibridge.custom_exceptions.ResourceNotFoundException;
import com.medibridge.dtos.MedicineDto;
import com.medibridge.dtos.NgoWithServiceAreaDto;
import com.medibridge.dtos.RequestedNgos;
import com.medibridge.dtos.UserDto;
import com.medibridge.dtos.AddressDto;
import com.medibridge.dtos.ApiResponse;
import com.medibridge.dtos.DonarDashboardDto;
import com.medibridge.dtos.DonarDto;
import com.medibridge.dtos.DonarRegistrationDto;
import com.medibridge.dtos.DonationsDto;
import com.medibridge.dtos.MedicineCategoryPercentageDto;
import com.medibridge.entities.User;
import com.medibridge.entities.userRole;
import com.medibridge.entities.chat.ChatRoom;
import com.medibridge.entities.donar.Address;
import com.medibridge.entities.donar.Donar;
import com.medibridge.entities.donar.ListingStatus;
import com.medibridge.entities.donar.Medicine;
import com.medibridge.entities.donar.MedicineCategory;
import com.medibridge.entities.ngo.Ngo;
import com.medibridge.entities.ngo.ServiceArea;
import com.medibridge.repository.ChatRoomRepository;
import com.medibridge.repository.DonarAddressRepository;
import com.medibridge.repository.DonarRepository;
import com.medibridge.repository.DonationsRepository;
import com.medibridge.repository.MedicineRepository;
import com.medibridge.repository.NgoRepository;
import com.medibridge.repository.UserRepository;
import com.medibridge.repository.ViewStatusNgoRepository;
@Service
@Transactional
public class DonarServiceImpl implements DonarService{
   
	
	 @Autowired
	    private NgoRepository ngoRepository;
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
    @Autowired
    private DonationsRepository donationsrepo;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ViewStatusNgoRepository viewStatusNgoRepository;
    @Autowired
    private S3Service s3Service;
    @Autowired
    private ChatRoomRepository chatrepo;
    
    @Override
    public String signUp(DonarRegistrationDto dto) {

        /* =======================
           1️⃣ CREATE USER
           ======================= */
        UserDto userDto = dto.getUser();

        // Optional but recommended: check email uniqueness
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setEmail(userDto.getEmail());
        user.setMobile(userDto.getMobile());
        user.setUserRole(userRole.valueOf(userDto.getUserRole()));
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));

        userRepository.save(user);

        Donar donar = new Donar();
        donar.setFirstName(userDto.getFirstName());
        donar.setLastName(userDto.getLastName());
        donar.setUser(user);

        donarRepository.save(donar); // donar_id generated here

     
        AddressDto addressDto = dto.getAddress();

        Address address = new Address();
        address.setFullAddress(addressDto.getFullAddress());
        address.setCity(addressDto.getCity());
        address.setState(addressDto.getState());
        address.setPincode(addressDto.getPincode());
        address.setActive(true);
        address.setDonar(donar);

        donarAddressRepository.save(address);


        return "Donor registered successfully";
    }


	@Override
	public Donar getDonarDetails(Long user_id) {
		return donarRepository.findById(user_id).orElseThrow(() -> new ResourceNotFoundException("Invalid user id !!!"));
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
	public ApiResponse addMedicine(MedicineDto medicinedto ,  MultipartFile image) throws IOException {
		
        	
		if(medicineRepository.existsBymedicineName(medicinedto.getMedicineName()))
		{
			throw new ApiException("medicine already exists!!!!!!!");
		}
		Donar donar = donarRepository.getById(medicinedto.getDonarid());
		String imageURL =	s3Service.uploadFile(image, "medicine-images/donar_" + donar.getId());	
		Medicine medicine = new Medicine();
		medicine.setDonar(donar);
		medicine.setExpiry_date(medicinedto.getExpiry_date());
		medicine.setMedicinecategory(medicinedto.getMedicinecategory());
		medicine.setMedicineName(medicinedto.getMedicineName());
		medicine.setMedicineImageUrl(imageURL);
		medicine.setListingStatus(ListingStatus.NotListed);
		medicine.setQuantity(medicinedto.getQuantity()); 
		Medicine medicineSave = medicineRepository.save(medicine);
		return new ApiResponse("New medicne added with ID=" + medicineSave.getId(), "Success");
	}
	
	@Override
	public List<Address> getAllDonarAddress(Long donar_id) {
		 return donarAddressRepository.findByDonarId(donar_id);
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

	@Override
	public List<AddressDto> getListOfActiveAddress() {
		List<Address> addresslist = donarRepository.findAllActiveAddress();
		List<AddressDto> addressdtolist = new ArrayList();
		
		for(Address address : addresslist)
		{
			addressdtolist.add(modelMapper.map(address, AddressDto.class));
		}
		 return addressdtolist;
	}
	
	@Override
	public List<RequestedNgos> getRequestedNgoByMedicineid(Long medicine_id) {
		
		List<RequestedNgos> ngodetails = donarRepository.fetchRequestedNgoByMedicineid(medicine_id);
		if(ngodetails==null) {
			throw  new RuntimeException("No Ngos Requested");
		}
		return ngodetails;
	}

	@Override
	public int getMedicineCount(Long donar_id) {
		int count=donarRepository.getAllMedicineCount(donar_id);
		return count;
	}

	@Override
	public int getListedMedicineCount(Long donar_id) {
		int listedCount=medicineRepository.getListedMedicinesCount(donar_id);
		return  listedCount;
	}

	@Override
	public int getUnListedMedicineCount(Long donar_id) {
		int unListedCount=medicineRepository.getUnListedMedicinesCount(donar_id);
		return unListedCount;
	}

	@Override
	public int getExpiredMedicineCount(Long donar_id) {
		int expiredCount=medicineRepository.getExpiredMedicinesCount(donar_id);
		return expiredCount;
	}

	@Override
	public int getExpiringSoonMedicineCount(Long donar_id) {
		// TODO Auto-generated method stub
		LocalDate today = LocalDate.now();
		LocalDate threeMonthsLater = today.plusMonths(3);
	int getExpiringSoonMedicineCount=medicineRepository.getMedicinesExpiringSoon(donar_id, today, threeMonthsLater);
		return getExpiringSoonMedicineCount;
	}

	@Override
	public ApiResponse changeDonarApprovalToApproved(Long medicine_id , Long ngo_id) {
		int res = viewStatusNgoRepository.updateDonationStatusToApproved(medicine_id, ngo_id);
		Long donar_id= medicineRepository.getDonarId(medicine_id);
		int added=viewStatusNgoRepository.updateDonation(donar_id, medicine_id, ngo_id);
		
		ChatRoom chatroom = chatrepo.CheckIfChatRoomExist(ngo_id, donar_id);
		if(chatroom == null)
		{
			Donar d = donarRepository.getById(donar_id);
			Ngo n = ngoRepository.getById(ngo_id);
			ChatRoom  ch = new ChatRoom();	
			ch.setDonar(d);
			ch.setNgo(n);
			chatrepo.save(ch);
		}
		
		
		if (res == 1) {
			return new ApiResponse("Changes are done" , "Success");
		}
		else {
			return new ApiResponse("Changes are not done" , "Failure");
		}
		
	}

	@Override
	public ApiResponse changeDonarApprovalToNotApproved(Long medicine_id , Long ngo_id) {
		int res = viewStatusNgoRepository.updateDonationStatusNotApproved(medicine_id, ngo_id);
		if (res == 1) {
			return new ApiResponse("Changes are done" , "Success");
		}
		else {
			return new ApiResponse("Changes are not done" , "Failure");
		}
		 
	}

	@Override
	public Long isMedicineDonationInProgress(Long medicine_id) {
		
		return medicineRepository.isMedicineDonationInProgress(medicine_id);
	}

	@Override
	public ApiResponse ChangeListingStatusNotListed(Long medicine_id) {
		Medicine medicine =  medicineRepository.getById(medicine_id);
		medicine.setListingStatus(ListingStatus.NotListed);
		medicineRepository.save(medicine);
		return  new ApiResponse("Medicine ListingStatus Changed", "Success");
	}

	@Override
	public ApiResponse ChangeListingStatusToisListed(Long medicine_id) {
		// TODO Auto-generated method stub
		Medicine medicine =  medicineRepository.getById(medicine_id);
		medicine.setListingStatus(ListingStatus.IsListed);
		medicineRepository.save(medicine);
		return  new ApiResponse("Medicine ListingStatus Changed", "Success");
	}

	@Override
	public NgoWithServiceAreaDto getNgoDetailsForARequestedMedicineByMedicineIdApprovedByDonar(Long medicine_id) {
		Long ngo_id = viewStatusNgoRepository.getNgoIdForARequestedMedicineByMedicineIdWhichIsApprovedByDonar(medicine_id);
		NgoWithServiceAreaDto ngowithservicearea = ngoRepository.getNgoWithServiceAreaByNgoId(ngo_id);
		return ngowithservicearea;
	}
	@Override
	public int completedDonations(Long donar_id) {
		int completed=donarRepository.completedDonations(donar_id);
		return completed;
	}

	@Override
	public int requestedMedicinesCount(Long donar_id) {
		// TODO Auto-generated method stub
		int requestedMedicinesCount=donarRepository.requestedMedicinesCount(donar_id);
		return requestedMedicinesCount;
	}

	@Override
	public void adddonarAddress(AddressDto addressdto) {

	    // 1️⃣ Fetch Donar
	    Donar donar = donarRepository.findById(addressdto.getDonarId())
	            .orElseThrow(() -> 
	                new RuntimeException("Donar not found with id : " + addressdto.getDonarId())
	            );

	    // 2️⃣ Create Address entity
	    Address address = new Address();
	    address.setFullAddress(addressdto.getFullAddress());
	    address.setCity(addressdto.getCity());
	    address.setState(addressdto.getState());
	    address.setPincode(addressdto.getPincode());
	    address.setActive(addressdto.isActive());

	    // 3️⃣ Set relationship
	    address.setDonar(donar);

	    // 4️⃣ Save address
	    donarAddressRepository.save(address);
	}


	@Override
	public DonationsDto getDonationDtoByMedicineId(Long medicineId) {
		DonationsDto  dto = donationsrepo.getDonationDtoByMedicineId(medicineId);
		return dto;
	}


	@Override
	public void markRequestAsCompleted(Long medicine_id) {
		viewStatusNgoRepository.markAsDonatedCompleted(medicine_id);
		viewStatusNgoRepository.markAsDonationCompleted(medicine_id);
		medicineRepository.markAsDonated(medicine_id);	
	}


	@Override
	public void markRequestAsDiscarded(Long medicine_id) {
		viewStatusNgoRepository.markAsDiscarded(medicine_id);
		viewStatusNgoRepository.markAsDonationDiscarded(medicine_id);	
	}
	
	

}

package com.medibridge.service;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.medibridge.dtos.AddressDto;
import com.medibridge.dtos.ApiResponse;
import com.medibridge.dtos.DonorWithAddressDto;
import com.medibridge.dtos.ListedMedicineInAreaDto;
import com.medibridge.dtos.MedicineCategoryPercentageDto;
import com.medibridge.dtos.MedicineDto;
import com.medibridge.dtos.NgoDetailsDto;
import com.medibridge.dtos.ServiceAreaDto;
import com.medibridge.dtos.ServiceAreaUpdateDto;
import com.medibridge.dtos.ViewStatusDtoDonarId;
import com.medibridge.entities.DonationStatusDon;
import com.medibridge.entities.Donations;
import com.medibridge.entities.User;
import com.medibridge.entities.userRole;
import com.medibridge.entities.donar.Address;
import com.medibridge.entities.donar.DonationStatus;
import com.medibridge.entities.donar.ListingStatus;
import com.medibridge.entities.donar.Medicine;
import com.medibridge.entities.ngo.DocumentRegistration;
import com.medibridge.entities.ngo.DonarApproval;
import com.medibridge.entities.ngo.DonationStatusNgo;
import com.medibridge.entities.ngo.Ngo;
import com.medibridge.entities.ngo.ServiceArea;
import com.medibridge.entities.ngo.ViewStatusNgo;
import com.medibridge.repository.DonarRepository;
import com.medibridge.repository.DonationsRepository;
import com.medibridge.repository.MedicineRepository;
import com.medibridge.repository.NgoRepository;
import com.medibridge.repository.ServiceAreaRepository;
import com.medibridge.repository.UserRepository;
import com.medibridge.repository.ViewStatusNgoRepository;

@Service
public class NgoServiceImpl implements NgoService{

	
	private static final String GOOGLE_DISTANCE_MATRIX_API_KEY = "AIzaSyC4g6WxdDCx7UoDKC0mF9c0-Tyx6hjehOs";
//	private static final String GOOGLE_DISTANCE_MATRIX_API_KEY ="";
	private static final double SERVICE_RADIUS_KM = 80; 
    @Autowired
    private NgoRepository ngoRepository;
    
    @Autowired
    private ViewStatusNgoRepository viewStatusNgoRepository;
    
    @Autowired
    private ServiceAreaRepository serviceRepository;
   
    @Autowired
   	private MedicineRepository medicineRepository ;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private DonarRepository donarRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private S3Service s3Service;
    
    @Autowired
    private DonationsRepository donationsRepository;
    
    @Autowired
    private ModelMapper modelMapper;
	
	@Override
	public List<Medicine> getAllListedMedicines() {
		// TODO Auto-generated method stub
		return null;
	}

	

	
	@Override
	public ApiResponse changeDonationStatusNgoToDonationProcessStarted(Long medicineId, Long ngoId) {
		ViewStatusNgo viewStatusNgo = viewStatusNgoRepository.findByMedicineIdAndNgoId(medicineId, ngoId) .orElseThrow(() ->
        new RuntimeException( "No status found for medicineId: " + medicineId +  " and ngoId: " + ngoId));

		viewStatusNgo.setDonarapproval(DonarApproval.Donar_NotApproved);
		viewStatusNgo.setDonationStatusNgo(DonationStatusNgo.DonationProcessNotStarted);
		
		viewStatusNgoRepository.save(viewStatusNgo);
		
		return new ApiResponse( "Donation process started and donor approved successfully","SUCCESS");
	}

	@Override
	public ApiResponse changeDonationStatusNgoToDonationProcessNotStarted( Long medicineId, Long ngoId) {
		 ViewStatusNgo viewStatusNgo =
		            viewStatusNgoRepository.findByMedicineIdAndNgoId(medicineId, ngoId)
		                    .orElseThrow(() ->new RuntimeException("No status found for medicineId: " + medicineId +" and ngoId: " + ngoId));

		    viewStatusNgo.setDonarapproval(DonarApproval.Donar_Approved);
		    viewStatusNgo.setDonationStatusNgo(
		            DonationStatusNgo.DonationProcessStarted
		    );
		    viewStatusNgoRepository.save(viewStatusNgo);

		    if (donationsRepository.existsByMedicineId(medicineId)) {
		        return new ApiResponse( "Donation already exists for this medicine","FAILED");
		    }

		    Donations donation = new Donations();
		    donation.setMedicine(viewStatusNgo.getMedicine());
		    donation.setNgo(viewStatusNgo.getNgo());
		    donation.setDonar(viewStatusNgo.getMedicine().getDonar());
		    donation.setDonationstatus(DonationStatusDon.Pending); // stored as tinyint = 1

		    donationsRepository.save(donation);

		    return new ApiResponse( "Donation process started and donation entry created successfully","SUCCESS" );
	}

	@Override
	public ApiResponse addToViewStatusNgo(ViewStatusDtoDonarId viewstatusdto) {
		   if (viewstatusdto == null ||
		            viewstatusdto.getMedicineId() == null ||
		            viewstatusdto.getNgoId() == null) {

		            return new ApiResponse( "Invalid data: NGO or Medicine is missing","FAILED");
		        }

		        Long ngoId = viewstatusdto.getNgoId();
		        Long medicineId = viewstatusdto.getMedicineId();

//		         1️⃣ Check if already exists (medicine_id is UNIQUE)
		        if (viewStatusNgoRepository.existsByMedicineIdAndNgoId(medicineId, ngoId)) {

		            return new ApiResponse( "View status already exists for this NGO and Medicine","FAILED");
		        }
		        
		        Ngo ngo = ngoRepository.findById(ngoId).orElseThrow(() -> new RuntimeException("Ngo not found"));
		        Medicine medicine = medicineRepository.findById(medicineId).orElseThrow(() -> new RuntimeException("Medicine not found"));

		        // 2️⃣ Create entity
		        ViewStatusNgo viewStatusNgo = new ViewStatusNgo();
		        viewStatusNgo.setNgo(ngo);
		        viewStatusNgo.setMedicine(medicine);

		        // defaults are already set in entity, but explicit is safer
		        viewStatusNgo.setDonarapproval(DonarApproval.Donar_NotApproved);
		        viewStatusNgo.setDonationStatusNgo(
		                DonationStatusNgo.DonationProcessNotStarted
		        );

		        // 3️⃣ Save
		        viewStatusNgoRepository.save(viewStatusNgo);

		        return new ApiResponse( "View status created successfully","SUCCESS" );
	}

    @Override
    public Ngo registerNGO(Ngo ngo) {

        if (userRepository.existsByEmail(ngo.getUser().getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (!ngo.getConfirmPassword()
                .equals(ngo.getUser().getPassword())) {
            throw new RuntimeException("Password mismatch");
        }

        User user = ngo.getUser();
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setUserRole(userRole.ROLE_NGO);

        ngo.setUser(user);

        return ngoRepository.save(ngo);
    }

    // STEP 2
    @Override
    public void uploadDocuments(
            Long ngoId,
            MultipartFile registrationCert,
            MultipartFile taxCert,
            MultipartFile idProof) throws IOException {

        Ngo ngo = ngoRepository.findById(ngoId)
                .orElseThrow(() -> new RuntimeException("NGO not found"));

        String regUrl = s3Service.uploadFile(registrationCert, "ngo/" + ngoId + "/registration");
        String taxUrl = s3Service.uploadFile(taxCert, "ngo/" + ngoId + "/tax");
        String idUrl  = s3Service.uploadFile(idProof, "ngo/" + ngoId + "/id");

        DocumentRegistration doc = new DocumentRegistration();
        doc.setRegistrationCertificate(regUrl);
        doc.setTaxExemptionCertificate(taxUrl);
        doc.setContactPersonIdProof(idUrl);

        ngo.setDocumentRegistration(doc);

        ngoRepository.save(ngo);
    }

    // STEP 3
    @Override
    public void saveServiceArea(Long ngoId, ServiceArea serviceArea) {

        Ngo ngo = ngoRepository.findById(ngoId)
                .orElseThrow(() -> new RuntimeException("NGO not found"));

        ngo.setServiceArea(serviceArea);
        ngoRepository.save(ngo);
    }

	@Override
	public ServiceAreaDto getServiceAreaOfNgo(Long Ngo_id) {
		ServiceArea sevicearea = ngoRepository.findServiceAreaByNgoId(Ngo_id);
		ServiceAreaDto serviceareadto = modelMapper.map(sevicearea, ServiceAreaDto.class);
		return serviceareadto;
	}


	
	private Double getDistanceInKm(String origin, String destination, RestTemplate restTemplate) {

	    try {
	        String url =
	                "https://maps.googleapis.com/maps/api/distancematrix/json" +
	                "?origins=" + URLEncoder.encode(origin, StandardCharsets.UTF_8) +
	                "&destinations=" + URLEncoder.encode(destination, StandardCharsets.UTF_8) +
	                "&key=" + GOOGLE_DISTANCE_MATRIX_API_KEY;

	        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

	        if (response == null || !"OK".equals(response.get("status")))
	            return null;

	        List<Map<String, Object>> rows =
	                (List<Map<String, Object>>) response.get("rows");
	        if (rows.isEmpty()) return null;

	        Map<String, Object> row0 = rows.get(0);
	        List<Map<String, Object>> elements =
	                (List<Map<String, Object>>) row0.get("elements");
	        if (elements.isEmpty()) return null;

	        Map<String, Object> element0 = elements.get(0);
	        if (!"OK".equals(element0.get("status"))) return null;

	        Map<String, Object> distance =
	                (Map<String, Object>) element0.get("distance");

	        return ((Number) distance.get("value")).doubleValue() / 1000;

	    } catch (Exception e) {
	        e.printStackTrace();
	        return null;
	    }
	}

	@Override
	public List<ListedMedicineInAreaDto> getListMedicinesInServiceRadius(Long ngoId) {

	    ServiceArea sa = ngoRepository.findServiceAreaByNgoId(ngoId);

	    String ngoAddress =
	            sa.getStreetAddress() + ", " +
	            sa.getCity() + ", " +
	            sa.getState() + ", " +
	            sa.getZipCode() + ", India";

	    List<Address> addressList = donarRepository.findAllActiveAddress();
	    RestTemplate restTemplate = new RestTemplate();

	    List<ListedMedicineInAreaDto> result = new ArrayList<>();

	    for (Address address : addressList) {

	        String donorAddress =
	                address.getFullAddress() + ", " +
	                address.getCity() + ", " +
	                address.getState() + ", " +
	                address.getPincode() + ", India";

	        Double distanceKm = getDistanceInKm(ngoAddress, donorAddress, restTemplate);

	        if (distanceKm == null || distanceKm > SERVICE_RADIUS_KM)
	            continue;

	        List<Medicine> medicineList =
	                medicineRepository.findlistedMedicinesByDonarAvailableToNgo(
	                        address.getDonar().getId()
	                );

	        for (Medicine medicine : medicineList) {
	            ListedMedicineInAreaDto dto =
	                    modelMapper.map(medicine, ListedMedicineInAreaDto.class);
	            dto.setDistancefromdonar(distanceKm);
	            result.add(dto);
	        }
	    }

	    return result;
	}

	@Override
	public List<ListedMedicineInAreaDto> findPendingRequestMedicinesByNgoId(Long ngoId) {

	    ServiceArea sa = ngoRepository.findServiceAreaByNgoId(ngoId);
	    String ngoAddress = sa.getStreetAddress() + ", " + sa.getCity() + ", " +
	            sa.getState() + ", " + sa.getZipCode() + ", India";

	    List<Address> addressList = donarRepository.findAllActiveAddress();
	    RestTemplate restTemplate = new RestTemplate();

	    List<ListedMedicineInAreaDto> result = new ArrayList<>();

	    for (Address address : addressList) {

	        String donorAddress = address.getFullAddress() + ", " +
	                address.getCity() + ", " +
	                address.getState() + ", " +
	                address.getPincode() + ", India";

	        Double distanceKm = getDistanceInKm(ngoAddress, donorAddress, restTemplate);
	        if (distanceKm == null || distanceKm > SERVICE_RADIUS_KM) continue;

	        List<Medicine> medicines =
	                ngoRepository.findPendingRequestMedicines(
	                        ngoId, address.getDonar().getId());

	        for (Medicine medicine : medicines) {
	            ListedMedicineInAreaDto dto =
	                    modelMapper.map(medicine, ListedMedicineInAreaDto.class);
	            dto.setDistancefromdonar(distanceKm);
	            result.add(dto);
	        }
	    }
	    return result;
	}

	@Override
	public List<ListedMedicineInAreaDto> findRejectedRequestMedicines(Long ngoId) {

	    ServiceArea sa = ngoRepository.findServiceAreaByNgoId(ngoId);
	    String ngoAddress = sa.getStreetAddress() + ", " + sa.getCity() + ", " +
	            sa.getState() + ", " + sa.getZipCode() + ", India";

	    List<Address> addressList = donarRepository.findAllActiveAddress();
	    RestTemplate restTemplate = new RestTemplate();

	    List<ListedMedicineInAreaDto> result = new ArrayList<>();

	    for (Address address : addressList) {

	        String donorAddress = address.getFullAddress() + ", " +
	                address.getCity() + ", " +
	                address.getState() + ", " +
	                address.getPincode() + ", India";

	        Double distanceKm = getDistanceInKm(ngoAddress, donorAddress, restTemplate);
	        if (distanceKm == null || distanceKm > SERVICE_RADIUS_KM) continue;

	        List<Medicine> medicines =
	                ngoRepository.findRejectedRequestMedicines(
	                        ngoId, address.getDonar().getId());

	        for (Medicine medicine : medicines) {
	            ListedMedicineInAreaDto dto =
	                    modelMapper.map(medicine, ListedMedicineInAreaDto.class);
	            dto.setDistancefromdonar(distanceKm);
	            result.add(dto);
	        }
	    }
	    return result;
	}

	@Override
	public List<ListedMedicineInAreaDto> findOnGoingRequestMedicines(Long ngoId) {

	    ServiceArea sa = ngoRepository.findServiceAreaByNgoId(ngoId);
	    String ngoAddress = sa.getStreetAddress() + ", " + sa.getCity() + ", " +
	            sa.getState() + ", " + sa.getZipCode() + ", India";

	    List<Address> addressList = donarRepository.findAllActiveAddress();
	    RestTemplate restTemplate = new RestTemplate();

	    List<ListedMedicineInAreaDto> result = new ArrayList<>();

	    for (Address address : addressList) {

	        String donorAddress = address.getFullAddress() + ", " +
	                address.getCity() + ", " +
	                address.getState() + ", " +
	                address.getPincode() + ", India";

	        Double distanceKm = getDistanceInKm(ngoAddress, donorAddress, restTemplate);
	        if (distanceKm == null || distanceKm > SERVICE_RADIUS_KM) continue;

	        List<Medicine> medicines =
	                ngoRepository.findOnGoingRequestMedicines(
	                        ngoId, address.getDonar().getId());

	        for (Medicine medicine : medicines) {
	            ListedMedicineInAreaDto dto =
	                    modelMapper.map(medicine, ListedMedicineInAreaDto.class);
	            dto.setDistancefromdonar(distanceKm);
	            result.add(dto);
	        }
	    }
	    return result;
	}


	@Override
	public List<MedicineDto> getAllDonatedMedicinesByNgoId(Long Ngo_id) {
		List<Medicine> medicinelist = donationsRepository.getAllCompletedMedicinesByNgoId(Ngo_id);
		List<MedicineDto> meddtolist = new ArrayList();
		for(Medicine medicine : medicinelist)
		{
			meddtolist.add(modelMapper.map(medicine, MedicineDto.class));
		}
		
		return meddtolist;
	}

	@Override
	public List<MedicineCategoryPercentageDto> getMedicineCategoryByPercentage(Long ngo_id) {
		
		int totalMedicines=ngoRepository.getTotalMedicines(ngo_id);
		System.out.println(totalMedicines);
	    List<Object[]> result=ngoRepository.countMedicinesByCategoryForNgo(ngo_id);
	    return result.stream()
	            .map(row -> {
	                String medicineCategory = row[0].toString();

	                double categoryQuantity = ((Number) row[1]).doubleValue();

	                double percentage = (categoryQuantity * 100.0) / totalMedicines;
	                percentage = Math.round(percentage * 100.0) / 100.0;

	                return new MedicineCategoryPercentageDto(medicineCategory, percentage);
	            })
	            .toList();	
	}




	@Override
	public DonorWithAddressDto getDonorWithAddressByNgoAndMedicineNative(Long ngoId, Long medicineId) {
		DonorWithAddressDto donarwithadress =	ngoRepository.getDonorWithAddressByNgoAndMedicine(ngoId, medicineId);
		return donarwithadress;
	}




	@Override
	public Long rejectedngos(Long medicine_id) {
		
		return ngoRepository.rejectedngo(medicine_id);
		
	}
	
	@Override
	public String updateServiceRadius(Long ngo_id,Long service_radius) {
		
	int update=ngoRepository.updateServiceDetails(ngo_id, service_radius);
	if(update==0) {
		return "unable to update service radius";
	}
		return "Service Radius Updated Succesfully";
	}




	@Override
	public String updateServiceArea(Long ngo_id, ServiceAreaUpdateDto request) {
	
		ServiceArea service=ngoRepository.findServiceAreaByNgoId(ngo_id);
		System.out.println(service);
		if (service == null) {
	        throw new RuntimeException("Service Area not found for NGO id: " + ngo_id);
	    }
		    service.setCity(request.getCity());
		    service.setLandMark(request.getLandMark());
		    service.setState(request.getState());
		    service.setDistrict(request.getDistrict());
		    service.setStreetAddress(request.getStreetAddress());
		    service.setZipCode(request.getZipCode());
		    service.setPrimaryContact(request.getPrimaryContact());
		    serviceRepository.save(service);
		    return "Service Area updated successfully";
	}




	@Override
	public NgoDetailsDto getNgoDetails(Long ngo_id) {
		
		return ngoRepository.findNgoDetailsById(ngo_id);
		
	}

	


}


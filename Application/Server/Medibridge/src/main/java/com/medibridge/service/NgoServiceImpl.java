package com.medibridge.service;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.medibridge.dtos.AddressDto;
import com.medibridge.dtos.ApiResponse;
import com.medibridge.dtos.ListedMedicineInAreaDto;
import com.medibridge.dtos.MedicineDto;
import com.medibridge.dtos.ServiceAreaDto;
import com.medibridge.dtos.ViewStatusDto;
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
import com.medibridge.repository.UserRepository;
import com.medibridge.repository.ViewStatusNgoRepository;

@Service
public class NgoServiceImpl implements NgoService{

    @Autowired
    private NgoRepository ngoRepository;

    @Autowired
    private ViewStatusNgoRepository viewStatusNgoRepository;
    
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
	public ApiResponse changeDonarApprovalToApproved(Long donarId) {
		List<Medicine> medicines = medicineRepository.findByDonarId(donarId);

	    if (medicines == null || medicines.isEmpty()) {
	        return new ApiResponse(
	                "No medicines found for donor id: " + donarId,
	                "FAILED"
	        );
	    }

	    // ✅ Only collect medicines that must be updated
	    List<Medicine> medicinesToApprove = new ArrayList<>();

	    for (Medicine medicine : medicines) {

	        if (medicine.getListingStatus() == ListingStatus.IsListed &&
	            medicine.getDonationStatus() != DonationStatus.Accepted) {

	            medicine.setDonationStatus(DonationStatus.Accepted);
	            medicinesToApprove.add(medicine);
	        }
	    }

	    if (medicinesToApprove.isEmpty()) {
	        return new ApiResponse(
	                "No LISTED medicines found to approve for donor id: " + donarId,
	                "FAILED"
	        );
	    }

	  
	    medicineRepository.saveAll(medicinesToApprove);

	    return new ApiResponse(
	            "Donation status updated to ACCEPTED for donor id: " + donarId,
	            "SUCCESS"
	    );
	}

	@Override
	public ApiResponse changeDonarApprovalToNotApproved(Long donarId) {
		 List<Medicine> medicines = medicineRepository.findByDonarId(donarId);

		    if (medicines == null || medicines.isEmpty()) {
		        return new ApiResponse(
		                "No medicines found for donor id: " + donarId,
		                "FAILED"
		        );
		    }

		    boolean updated = false;

		    for (Medicine medicine : medicines) {

		        // ✅ STRICT condition
		        if (medicine.getListingStatus() == ListingStatus.IsListed) {

		            medicine.setListingStatus(ListingStatus.NotListed);
		            updated = true;
		        }
		    }

		    if (!updated) {
		        return new ApiResponse(
		                "No listed medicines found for donor id: " + donarId,
		                "FAILED"
		        );
		    }

		    medicineRepository.saveAll(medicines);

		    return new ApiResponse(
		            "Listing status changed to NOT_LISTED for donor id: " + donarId,
		            "SUCCESS"
		    );
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
	public ApiResponse addToViewStatusNgo(ViewStatusDto viewstatusdto) {
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

	@Override
	public List<ListedMedicineInAreaDto> getListMedicinesInServiceRadius(Long ngoId) {

	    ServiceArea sa = ngoRepository.findServiceAreaByNgoId(ngoId);

	    String ngoAddress = sa.getStreetAddress() + ", " + sa.getCity() + ", " + sa.getState() + ", " + sa.getZipCode() + ", India";
	 

	    List<Address> addressList = donarRepository.findAllActiveAddress();
	    RestTemplate restTemplate = new RestTemplate();
	    List<ListedMedicineInAreaDto> medicineDtolist = new ArrayList();

	    for (Address address : addressList) {

	        String donorAddress = address.getFullAddress() + ", " + address.getCity() + ", " + address.getState() + ", " + address.getPincode() + ", India";

	        String url = "https://api.distancematrix.ai/maps/api/distancematrix/json?origins=" + URLEncoder.encode(ngoAddress, StandardCharsets.UTF_8) + "&destinations=" + URLEncoder.encode(donorAddress, StandardCharsets.UTF_8) + "&key=0isMFectINCLWIOYtTbiBcjuzDR6E2VKuX5PZi3y1bkx1WYlKQHcuyXnlFeSlqns";

	        Map response = restTemplate.getForObject(url, Map.class);
	   
	        try {
	            List rows = (List) response.get("rows");
	            Map row0 = (Map) rows.get(0);
	            List elements = (List) row0.get("elements");
	            Map element0 = (Map) elements.get(0);

	            if (!"OK".equals(element0.get("status"))) continue;

	            Map distance = (Map) element0.get("distance");
	            double distanceKm = ((Number) distance.get("value")).doubleValue() / 1000;

	            System.out.println("DISTANCE KM => " + distanceKm);

	            if (distanceKm <= sa.getServiceRadius()) {
	            	
	            	List<Medicine> medicinelist = medicineRepository.findlistedMedicinesByDonarAvailableToNgo(address.getDonar().getId());
	            	System.out.println(medicinelist);
	               for(Medicine medicine : medicinelist)
	               {
	            	   ListedMedicineInAreaDto listedmedicine =  modelMapper.map(medicine, ListedMedicineInAreaDto.class);
	            	   listedmedicine.setDistancefromdonar(distanceKm);
	            	   medicineDtolist.add(listedmedicine);
	               }
	            }

	        } catch (Exception e) {
	            e.printStackTrace();
	        }
	    }

	    return medicineDtolist;
	}



	




}


package com.medibridge.service;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.medibridge.dtos.ApiResponse;
import com.medibridge.dtos.ViewStatusDto;
import com.medibridge.entities.User;
import com.medibridge.entities.userRole;
import com.medibridge.entities.donar.Medicine;
import com.medibridge.entities.ngo.DocumentRegistration;
import com.medibridge.entities.ngo.Ngo;
import com.medibridge.entities.ngo.ServiceArea;
import com.medibridge.repository.NgoRepository;
import com.medibridge.repository.UserRepository;

@Service
public class NgoServiceImpl implements NgoService{

    @Autowired
    private NgoRepository ngoRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private S3Service s3Service;
	
	@Override
	public List<Medicine> getAllListedMedicines() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ApiResponse changeDonarApprovalToApproved() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ApiResponse changeDonarApprovalToNotApproved() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ApiResponse changeDonationStatusNgoToDonationProcessStarted() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ApiResponse changeDonationStatusNgoToDonationProcessNotStarted() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ApiResponse addToViewStatusNgo(ViewStatusDto viewstatusdto) {
		// TODO Auto-generated method stub
		return null;
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
}


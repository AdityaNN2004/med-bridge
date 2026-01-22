package com.medibridge.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.medibridge.dtos.AddressDto;
import com.medibridge.dtos.ApiResponse;
import com.medibridge.dtos.ListedMedicineInAreaDto;
import com.medibridge.dtos.MedicineDto;
import com.medibridge.dtos.ServiceAreaDto;
import com.medibridge.dtos.ViewStatusDto;
import com.medibridge.entities.ngo.Ngo;
import com.medibridge.entities.ngo.ServiceArea;

import com.medibridge.service.NgoService;

import jakarta.validation.Valid;
//http://localhost:5173/ngo/register
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/ngo")
public class NgoController {

    @Autowired
    private NgoService ngoService;

    // STEP 1 – Register NGO + User
    @PostMapping("/register1")
    public ResponseEntity<Ngo> registerNGO(@RequestBody Ngo ngo) {
        Ngo savedNgo = ngoService.registerNGO(ngo);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedNgo);
    }

    // STEP 2 – Upload Documents
    @PostMapping(
        value = "/{ngoId}/documents",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> uploadDocuments(
            @PathVariable Long ngoId,
            @RequestParam("registrationCertificate") MultipartFile registrationCert,
            @RequestParam("taxExemptionCertificate") MultipartFile taxCert,
            @RequestParam("contactIdProof") MultipartFile idProof) throws IOException {

        ngoService.uploadDocuments(ngoId, registrationCert, taxCert, idProof);
        return ResponseEntity.ok("Documents uploaded successfully");
    }

    // STEP 3 – Save Service Area
    @PostMapping("/{ngoId}/service-area")
    public ResponseEntity<?> addServiceArea(
            @PathVariable Long ngoId,
            @RequestBody ServiceArea serviceArea) {

        ngoService.saveServiceArea(ngoId, serviceArea);
        return ResponseEntity.ok("Service area saved successfully");
    }
    
    @GetMapping("/getlistmedicinesinserviceradius/{ngoId}")
    public ResponseEntity<?> getListMedicinesInServiceRadius(@PathVariable Long ngoId) {
        
        List<ListedMedicineInAreaDto> result =  ngoService.getListMedicinesInServiceRadius(ngoId);
               
        if (result == null) {
            return ResponseEntity.noContent().build();
         }

        return ResponseEntity.ok(result);
    }
    
  
    @PutMapping("/donor/{donarId}/approve")
    public ResponseEntity<ApiResponse> approveDonor(@PathVariable Long donarId) {

        ApiResponse response =
                ngoService.changeDonarApprovalToApproved(donarId);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    @PutMapping("/donor/{donarId}/reject")
    public ResponseEntity<ApiResponse> rejectDonor(  @PathVariable Long donarId) {

        ApiResponse response =
                ngoService.changeDonarApprovalToNotApproved(donarId);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    
    @PutMapping("/donation/startprocess")
    public ResponseEntity<ApiResponse> startDonationProcess(@RequestParam Long medicineId, @RequestParam Long ngoId) {

        ApiResponse response =
                ngoService.changeDonationStatusNgoToDonationProcessStarted( medicineId, ngoId);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    
    @PutMapping("/donation/stoptprocess")
    public ResponseEntity<ApiResponse> stopDonationProcess(@RequestParam Long medicineId, @RequestParam Long ngoId) {

        ApiResponse response =
                ngoService.changeDonationStatusNgoToDonationProcessNotStarted(
                        medicineId, ngoId);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/addToViewStatusNgo")
    public ResponseEntity<ApiResponse> addToViewStatusNgo( @RequestBody ViewStatusDto dto) {

        ApiResponse response = ngoService.addToViewStatusNgo(dto);
        return ResponseEntity.ok(response);
    }
    
    
}

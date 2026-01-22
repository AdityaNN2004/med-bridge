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
import com.medibridge.dtos.MedicineCategoryPercentageDto;
import com.medibridge.dtos.MedicineDto;
import com.medibridge.dtos.ServiceAreaDto;
import com.medibridge.dtos.ViewStatusDtoDonarId;
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
    public ResponseEntity<ApiResponse> addToViewStatusNgo( @RequestBody ViewStatusDtoDonarId dto) {

        ApiResponse response = ngoService.addToViewStatusNgo(dto);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/findpendingrequestmedicinesbyngoid/{ngoId}")
    public ResponseEntity<?> findPendingRequestMedicinesByNgoId(@PathVariable Long ngoId) {
        
        List<ListedMedicineInAreaDto> result =  ngoService.findPendingRequestMedicinesByNgoId(ngoId);
               
        if (result == null) {
            return ResponseEntity.noContent().build();
         }

        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/findrejectedrequestmedicines/{ngoId}")
    public ResponseEntity<?> findRejectedRequestMedicines(@PathVariable Long ngoId) {
        
        List<ListedMedicineInAreaDto> result =  ngoService.findRejectedRequestMedicines(ngoId);
               
        if (result == null) {
            return ResponseEntity.noContent().build();
         }

        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/findongoingrequestmedicines/{ngoId}")
    public ResponseEntity<?> findOnGoingRequestMedicines(@PathVariable Long ngoId) {
        
        List<ListedMedicineInAreaDto> result =  ngoService.findOnGoingRequestMedicines(ngoId);
               
        if (result == null) {
            return ResponseEntity.noContent().build();
         }

        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/getalldonatedmedicinesbyngoid/{ngoId}")
    public ResponseEntity<?> getAllDonatedMedicinesByNgoId(@PathVariable Long ngoId) {
        
        List<MedicineDto> result =  ngoService.getAllDonatedMedicinesByNgoId(ngoId);
        System.out.println(result);
        if (result == null) {
            return ResponseEntity.noContent().build();
         }
      
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/getMedicineCategoryByPercentage/{ngo_id}")
    public ResponseEntity<?> getMedicineCategoryByPercentage(@PathVariable Long ngo_id){
   	   
    List<MedicineCategoryPercentageDto> medicinecategory=ngoService.getMedicineCategoryByPercentage(ngo_id);
    
    return ResponseEntity.ok(medicinecategory);
    }

   

    
}

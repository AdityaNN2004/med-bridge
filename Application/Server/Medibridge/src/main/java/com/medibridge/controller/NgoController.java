package com.medibridge.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.medibridge.entities.ngo.Ngo;
import com.medibridge.entities.ngo.ServiceArea;

import com.medibridge.service.NgoService;
//http://localhost:5173/ngo/register
@CrossOrigin(origins = "http://localhost:5174")
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
}

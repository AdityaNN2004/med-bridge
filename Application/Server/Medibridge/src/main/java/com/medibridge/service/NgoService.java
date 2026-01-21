package com.medibridge.service;

import java.util.List;

import com.medibridge.dtos.ApiResponse;
import com.medibridge.dtos.ViewStatusDto;
import com.medibridge.entities.donar.Medicine;

public interface NgoService {

    List<Medicine> getAllListedMedicines();
    
    ApiResponse changeDonarApprovalToApproved();
    
    ApiResponse changeDonarApprovalToNotApproved();
    
    ApiResponse changeDonationStatusNgoToDonationProcessStarted();
    
    ApiResponse changeDonationStatusNgoToDonationProcessNotStarted();
    
    ApiResponse addToViewStatusNgo(ViewStatusDto viewstatusdto);
    
}

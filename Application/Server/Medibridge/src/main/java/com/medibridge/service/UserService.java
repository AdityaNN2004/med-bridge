package com.medibridge.service;

import org.springframework.stereotype.Service;

import com.medibridge.dtos.ApiResponse;
import com.medibridge.dtos.AuthRequest;
import com.medibridge.dtos.AuthResponse;
import com.medibridge.dtos.DonationDto;
@Service
public interface UserService {
   AuthResponse authenticateUser(AuthRequest dto);
   
   ApiResponse AddToDonations(DonationDto donationdto);
   
   ApiResponse changeDonationStatusToComplete();
   
   ApiResponse changeDonationStatusToPending();
   
   ApiResponse changeDonationStatusToDiscarded();
   
}

package com.medibridge.controller;
import java.time.LocalDate;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medibridge.entities.donar.MedicineCategory;
import com.medibridge.entities.donar.Donar;
import com.medibridge.entities.User;
import com.medibridge.entities.donar.Address;
import com.medibridge.entities.donar.Medicine;
import com.medibridge.service.DonarService;

import io.micrometer.core.ipc.http.HttpSender.Response;

import com.medibridge.dtos.MedicineDto;
import com.medibridge.dtos.NgoWithServiceAreaDto;
import com.medibridge.dtos.RequestedNgos;
import com.medibridge.dtos.AddressDto;
import com.medibridge.dtos.ApiResponse;
import com.medibridge.dtos.DonarDto;
import com.medibridge.dtos.MedicineCategoryPercentageDto;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/donar")

public class DonarController {
	@Autowired
  private DonarService donarService;
  
  @GetMapping("/getallmedicines/{donar_id}")
  public ResponseEntity<?> getAllMedicine(@PathVariable Long donar_id)
  {
	 System.out.println("donar id controller"+donar_id);
	List<MedicineDto> medicinelist = donarService.getAllMedicines(donar_id);
	if(medicinelist.isEmpty())
	{
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}
	return ResponseEntity.ok(medicinelist);
   }
  
  @GetMapping("/getunlistedmedicines/{donar_id}")
  public ResponseEntity<?> getUnListedMedicines(@PathVariable Long donar_id)
  {
	 System.out.println("donar id controller"+donar_id);
	List<MedicineDto> medicinelist = donarService.getUnListedMedicine(donar_id);
	if(medicinelist.isEmpty())
	{
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}
	return ResponseEntity.ok(medicinelist);
   }
  
  @GetMapping("/getlistedmedicines/{donar_id}")
  public ResponseEntity<?> getListedMedicines(@PathVariable Long donar_id)
  {
	 System.out.println("donar id controller"+donar_id);
	List<MedicineDto> medicinelist = donarService.getListedMedicine(donar_id);
	if(medicinelist.isEmpty())
	{
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}
	return ResponseEntity.ok(medicinelist);
   }
  
  @GetMapping("/getmedicinedetails/{medicine_id}")
  public ResponseEntity<?> getMedicinedetails(@PathVariable Long medicine_id)
  {
	MedicineDto medicine = donarService.getMedicineDetails(medicine_id);
	if(medicine == null )
	{
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}
	return ResponseEntity.ok(medicine);
   }
  
  @GetMapping("/deletemedicine/{medicine_id}")
  public ResponseEntity<?> deleteMedicine(@PathVariable Long medicine_id)
  {
	donarService.deleteMedicine(medicine_id);
	
	return ResponseEntity.ok("successfully deleted");
   }
  
  @GetMapping("/changelistingstatustoislistedmedicine/{medicine_id}")
  public ResponseEntity<?> ChangeListingStatusToisListed(@PathVariable Long medicine_id)
  {
	ApiResponse medicinelist = donarService.ChangeListingStatusToisListed(medicine_id);
	return ResponseEntity.ok(medicinelist);
   }
  @GetMapping("/changelistingstatustonotlisted/{medicine_id}")
  public ResponseEntity<?> ChangeListingStatusNotListed(@PathVariable Long medicine_id)
  {
	ApiResponse medicinelist = donarService.ChangeListingStatusNotListed(medicine_id);
	return ResponseEntity.ok(medicinelist);
   }
  
  @GetMapping("/getexpiredmedicines/{donar_id}")
  public ResponseEntity<?> getExpiredMedicines(@PathVariable Long donar_id)
  {
	 System.out.println("donar id controller"+donar_id);
	List<MedicineDto> medicinelist = donarService.getExpiredMedicines(donar_id);
	if(medicinelist.isEmpty())
	{
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}
	return ResponseEntity.ok(medicinelist);
   }
  
  @GetMapping("/getclosetoexpiredmedicines/{donar_id}")
  public ResponseEntity<?> getCloseToExpiredMedicines(@PathVariable Long donar_id)
  {
	 System.out.println("donar id controller"+donar_id);
	List<MedicineDto> medicinelist = donarService.getCloseToExpiryMedicine(donar_id);
	if(medicinelist.isEmpty())
	{
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}
	return ResponseEntity.ok(medicinelist);
   }
  
  @GetMapping("/getactivemedicines/{donar_id}")
  public ResponseEntity<?> getActiveMedicines(@PathVariable Long donar_id)
  {
	 System.out.println("donar id controller"+donar_id);
	List<MedicineDto> medicinelist = donarService.getActiveMedicine(donar_id);
	if(medicinelist.isEmpty())
	{
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}
	return ResponseEntity.ok(medicinelist);
   }
  
  
  @GetMapping("/addresses")
  public ResponseEntity<?> getAllDonarAddresses()
  {
	  
	List<Address> addresslist = donarService.getAllDonarAddress(1L);
	if(addresslist.isEmpty())
	{
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}
	return ResponseEntity.ok(addresslist);
   }
  @PostMapping("/addmedicine/{donar_id}")
  public ResponseEntity<?> addNewMedicine(@RequestBody MedicineDto req,@PathVariable Long donar_id)
  {
	try
	{	
		req.setDonarid(donar_id);
		return ResponseEntity.status(HttpStatus.CREATED).body(donarService.addMedicine(req));

	}
	catch(RuntimeException e)
	{
		System.out.println(e);
		return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiResponse(e.getMessage(), "Failed"));
	}
  }
  
  @GetMapping("/getdonardetails/{user_id}")
  public ResponseEntity<?> getDonarDetails(@PathVariable Long user_id)
  {	  
	  try
	  {		  
		  Donar donar = donarService.getDonarDetails(user_id);
		  if(donar == null)
			{
				return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
			}
			
		  return ResponseEntity.ok(donar);
	  }
	  catch(RuntimeException e)
	  {
		  return ResponseEntity.status(HttpStatus.NOT_FOUND) //SC 404
					.body(new ApiResponse(e.getMessage(), "Failed"));
	  }
   }
  
  @PutMapping("/{user_id}")
  public ResponseEntity<?> updateDonarDetails(@PathVariable Long user_id, @RequestBody DonarDto donardto)
  {
	  try {
	  return ResponseEntity.ok(donarService.updateDonarDetails(user_id, donardto));
       } catch (RuntimeException e) {
		return ResponseEntity.status(HttpStatus.NOT_FOUND)
				.body(new ApiResponse(e.getMessage(), "Failed"));
	   }
  }
  
  @PostMapping("/sign-up")
  public ResponseEntity<?> donarSignup( @RequestBody Donar donar)
  {
	  return ResponseEntity.ok(donarService.signUp(donar));
  }



  @DeleteMapping("/delete/{userId}")
  public ResponseEntity<?> deleteDonarDetails(@PathVariable Long userId){
	  
	  String message=donarService.deleteDonarDetails(userId);
	  if(message.isEmpty()) {
		  return ResponseEntity.noContent().build();
	  }
	 return ResponseEntity.ok(message);
	  
  }

  @GetMapping("/medicine/categorypercentage/{donarId}")
  public ResponseEntity<?> getMedicineCategoryPercentageByDonar(@PathVariable Long donarId) {
      
      List<MedicineCategoryPercentageDto> result =  donarService.getMedicineCategoryPercentageByDonar(donarId);
             
      if (result.isEmpty()) {
          return ResponseEntity.noContent().build();
       }
      return ResponseEntity.ok(result);
  }

  @GetMapping("/getactiveaddress/{donarId}")
  public ResponseEntity<?> getActiveAddressByDonar(@PathVariable Long donarId) {
      
      AddressDto result =  donarService.getActiveDonarAddress(donarId);
             
      if (result == null) {
          return ResponseEntity.noContent().build();
       }

      return ResponseEntity.ok(result);
  }
  

  @PutMapping("/makeaddressactive/{address_id}")

  public ResponseEntity<?> switchaddress(@PathVariable Long address_id){ 
	donarService.switchAddress(address_id);
    return ResponseEntity.ok("Address switched successfully");
  }
  
  @GetMapping("/getrequestedngosformedicine/{medicine_id}")
  public ResponseEntity<?> getRequestedNgos(@PathVariable Long medicine_id){
 	List<RequestedNgos> requestedngos= donarService.getRequestedNgoByMedicineid(medicine_id);
 	if(requestedngos==null) {
 		return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No Requested Ngos");
 	}
 	return ResponseEntity.ok(requestedngos);
  }
  

  @GetMapping("/getAllMedicinesCount/{donar_id}")
  public ResponseEntity<?> getAllMedcinesCount(@PathVariable Long donar_id){
 	int count= donarService.getMedicineCount(donar_id);
 	if(count==0) {
 		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
 	}
 	return ResponseEntity.ok(count);
  }
  
  @GetMapping("/getListedMedicinesCount/{donar_id}")
  public ResponseEntity<?> getListedMedcinesCount(@PathVariable Long donar_id){
 		int count= donarService.getListedMedicineCount(donar_id);
 		if(count==0) {
 			return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
 		}
 		return ResponseEntity.ok(count);
 	 }
  
  @GetMapping("/getUnListedMedicinesCount/{donar_id}")
  public ResponseEntity<?> getUnListedMedcinesCount(@PathVariable Long donar_id){
 		int count= donarService.getUnListedMedicineCount(donar_id);
 		if(count==0) {
 			return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
 		}
 		return ResponseEntity.ok(count);
 	 }
  
  @GetMapping("/getExpiredMedicinesCount/{donar_id}")
  public ResponseEntity<?> getExpiredMedcinesCount(@PathVariable Long donar_id){
 		int count= donarService.getExpiredMedicineCount(donar_id);
 		if(count==0) {
 			return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
 		}
 		return ResponseEntity.ok(count);
 	 }
  @GetMapping("/getExpiringSoonMedicinesCount/{donar_id}")
  public ResponseEntity<?> getExpiringSoonMedcinesCount(@PathVariable Long donar_id){
 		int count= donarService.getExpiringSoonMedicineCount(donar_id);
 		if(count==0) {
 			return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
 		}
 		return ResponseEntity.ok(count);
 	 }

  @PutMapping("/{medicine_id}/{ngo_id}/approve")
  public ResponseEntity<ApiResponse> approveDonor(@PathVariable Long medicine_id , @PathVariable Long ngo_id ) {

      ApiResponse response =
    		  donarService.changeDonarApprovalToApproved( medicine_id ,  ngo_id);

      return new ResponseEntity<>(response, HttpStatus.OK);
  }
  
  @PutMapping("/{medicine_id}/{ngo_id}/reject")
  public ResponseEntity<ApiResponse> rejectDonor(  @PathVariable Long medicine_id , @PathVariable Long ngo_id) {

      ApiResponse response =
    		  donarService.changeDonarApprovalToNotApproved( medicine_id ,  ngo_id);

      return new ResponseEntity<>(response, HttpStatus.OK);
  }
  
  @GetMapping("ismedicinedonationinprogress/{medicine_id}")
  public ResponseEntity<?> isMedicineDonationInProgress(  @PathVariable Long medicine_id) {

      Long response = donarService.isMedicineDonationInProgress( medicine_id );

      return ResponseEntity.ok(response);
  }
  
  
  
  @GetMapping("getngodetailsfoarequestedmedicinebyMedicineidapprovedbydonar/{medicine_id}")
  public ResponseEntity<?> getNgoDetailsForARequestedMedicineByMedicineIdApprovedByDonar(  @PathVariable Long medicine_id) {

	  NgoWithServiceAreaDto response = donarService.getNgoDetailsForARequestedMedicineByMedicineIdApprovedByDonar( medicine_id );

      return ResponseEntity.ok(response);
  }
  

  @GetMapping("/completeddonations/{donar_id}")
  public ResponseEntity<?> completedDonations(@PathVariable Long donar_id){
	 int completedDonation = donarService.completedDonations(donar_id);
	 if(completedDonation==0) {
		 ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	 }
	 return ResponseEntity.ok(completedDonation);
  }
  
  @GetMapping("/requestedMedicines/{donar_id}")
  public ResponseEntity<?> requestedMedicinesCount(@PathVariable Long donar_id){
	 int requestedMedicinesCount= donarService.requestedMedicinesCount(donar_id);
	 if(requestedMedicinesCount==0) {
		 ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	 }
	 return ResponseEntity.ok(requestedMedicinesCount);
  }
  
}
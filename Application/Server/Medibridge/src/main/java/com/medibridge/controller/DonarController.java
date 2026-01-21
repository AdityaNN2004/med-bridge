package com.medibridge.controller;
import java.time.LocalDate;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
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
import com.medibridge.dtos.MedicineDto;
import com.medibridge.dtos.ApiResponse;
import com.medibridge.dtos.DonarDto;

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
	List<MedicineDto> medicinelist = donarService.getCloseToExpiryMedicines(donar_id);
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
  
  @GetMapping("/{user_id}")
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

}


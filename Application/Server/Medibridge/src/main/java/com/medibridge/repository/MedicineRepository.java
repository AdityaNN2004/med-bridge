package com.medibridge.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.medibridge.entities.donar.Medicine;

import jakarta.transaction.Transactional;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long>{
     List<Medicine> findByDonarId(Long id);
     
	 boolean existsBymedicineName(String medicineName);
	
     	
	 @Query(value = "SELECT * FROM medicine WHERE donar_id = :donarId AND listing_status = 'NotListed'", nativeQuery = true)
	List<Medicine> findUnlistedMedicinesByDonar(@Param("donarId") Long donarId);

	 @Query(value = "SELECT * FROM medicine WHERE donar_id = :donarId AND listing_status = 'isListed'", nativeQuery = true)
	 List<Medicine> findlistedMedicinesByDonar(@Param("donarId") Long donarId);
	 
	 @Query(value = "SELECT DISTINCT m.* FROM medicine m LEFT JOIN viewstatus_ngo v ON v.medicine_id = m.medicine_id WHERE m.donar_id =  :donarId  AND m.listing_status = 'isListed' AND v.medicine_id IS NULL", nativeQuery = true)
	 List<Medicine> findlistedMedicinesByDonarAvailableToNgo(@Param("donarId") Long donarId);
	
	 @Query(value = "UPDATE medicne SET listing_status = 'isListed' WHERE donar_id = :donarId", nativeQuery = true)
	 void ChangeMedicneStatusToListed(@Param("donarId") Long donarId);
	 
	 @Query(value = "UPDATE medicne SET listing_status = 'NotListed' WHERE donar_id = :donarId", nativeQuery = true)
	 void ChangeMedicneStatusToNotListed(@Param("donarId") Long donarId);
	 
	 @Query(
			  value = """
			    SELECT * 
			    FROM medicine 
			    WHERE donar_id = :donarId 
			      AND expiry_date < CURRENT_DATE
			      AND listing_status <> 'Donated' AND listing_status = 'NotListed'
			  """,
			  nativeQuery = true
			)
			List<Medicine> findExpiredMedicines(@Param("donarId") Long donarId);

	 @Query(
			  value = """
			    SELECT * 
			    FROM medicine 
			    WHERE donar_id = :donarId 
			      AND expiry_date > DATE_ADD(CURRENT_DATE, INTERVAL 3 MONTH)
			      AND listing_status <> 'Donated'  AND listing_status = 'NotListed'
			  """,
			  nativeQuery = true
			)
			List<Medicine> findActiveMedicines(@Param("donarId") Long donarId);
	 @Query(
			  value = """
			    SELECT * 
			    FROM medicine 
			    WHERE donar_id = :donarId 
			      AND expiry_date BETWEEN :today AND :threeMonthsLater
			      AND listing_status <> 'Donated' AND listing_status = 'NotListed'
			  """,
			  nativeQuery = true
			)
			List<Medicine> findMedicinesExpiringSoon(
			    @Param("donarId") Long donarId,
			    @Param("today") LocalDate today,
			    @Param("threeMonthsLater") LocalDate threeMonthsLater
			);

	 @Query(value=" SELECT medicinecategory, COUNT(*) FROM Medicine WHERE donar_id = :donarId GROUP BY medicinecategory",nativeQuery=true)
	 List<Object[]> countMedicinesByCategoryForDonar(Long donarId);   
			   
	 @Query(value = "SELECT COUNT(*) FROM Medicine WHERE donar_id = :donarId",nativeQuery = true)
	 Long countByDonar_Id(@Param("donarId") Long donarId);   
			  
		
	 @Query(value="SELECT COUNT(*) FROM medicine WHERE donar_id = :donarId AND listing_status = 'isListed'",nativeQuery=true)
		 int getListedMedicinesCount(@Param("donarId") Long donar_id);
		 
		 @Query(value = "SELECT COUNT(*) FROM medicine WHERE donar_id = :donarId AND listing_status = 'NotListed'", nativeQuery = true)
		 int getUnListedMedicinesCount(@Param("donarId") Long donar_id);
				  		
		 @Query(value = "SELECT COUNT(*) FROM medicine WHERE donar_id = :donarId AND expiry_date < CURRENT_DATE", nativeQuery = true)
		 int getExpiredMedicinesCount(@Param("donarId") Long donarId);
		 
		 @Query(value = "SELECT COUNT(*) FROM medicine WHERE donar_id = :donarId AND expiry_date BETWEEN :today AND :threeMonthsLater", nativeQuery = true)
		 int getMedicinesExpiringSoon(@Param("donarId") Long donar_id, @Param("today") LocalDate today, @Param("threeMonthsLater") LocalDate threeMonthsLater);	

	
		 @Query(value = "SELECT COUNT(*) > 0 FROM viewstatus_ngo WHERE medicine_id = :medicineId AND donarapproval = 'Donar_Approved' AND donation_status_ngo = 'DonationProcessStarted'", nativeQuery = true)
		 Long isMedicineDonationInProgress(@Param("medicineId") Long medicineId);

		 @Query(value="SELECT donar_id from medicine WHERE medicine_id=:medicineId",nativeQuery = true)
		 Long getDonarId(@Param("medicineId") Long medicine_id);
		 
		   @Modifying
	       @Query(value="UPDATE medicine SET listing_status='Donated' WHERE medicine_id=:medicineid",nativeQuery = true)
	       int markAsDonated(@Param("medicineid") Long medicine_id);


}


package com.medibridge.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.medibridge.entities.donar.Medicine;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long>{
     List<Medicine> findByDonarId(Long id);
     
	 boolean existsBymedicineName(String medicineName);
	
     	
	 @Query(value = "SELECT * FROM medicine WHERE donar_id = :donarId AND listing_status = 'NotListed'", nativeQuery = true)
	List<Medicine> findUnlistedMedicinesByDonar(@Param("donarId") Long donarId);

	 @Query(value = "SELECT * FROM medicine WHERE donar_id = :donarId AND listing_status = 'isListed'", nativeQuery = true)
	 List<Medicine> findlistedMedicinesByDonar(@Param("donarId") Long donarId);
	
	 @Query(value = "UPDATE medicne SET listing_status = 'isListed' WHERE donar_id = :donarId", nativeQuery = true)
	 void ChangeMedicneStatusToListed(@Param("donarId") Long donarId);
	 
	 @Query(value = "UPDATE medicne SET listing_status = 'NotListed' WHERE donar_id = :donarId", nativeQuery = true)
	 void ChangeMedicneStatusToNotListed(@Param("donarId") Long donarId);
	 
	 @Query(value = "SELECT * FROM medicine WHERE donar_id = :donarId AND expiry_date < CURRENT_DATE", nativeQuery = true)
	 List<Medicine> findExpiredMedicines(@Param("donarId") Long donarId);
	 
	 @Query(value = "SELECT * FROM medicine WHERE donar_id = :donarId AND expiry_date > DATE_ADD(CURRENT_DATE, INTERVAL 3 MONTH)", nativeQuery = true)
	 List<Medicine> findActiveMedicines(@Param("donarId") Long donarId);

	 @Query(value = "SELECT * FROM medicine WHERE donar_id = :donarId AND expiry_date BETWEEN :today AND :threeMonthsLater", nativeQuery = true)
	 List<Medicine> findMedicinesExpiringSoon(@Param("donarId") Long donarId, @Param("today") LocalDate today, @Param("threeMonthsLater") LocalDate threeMonthsLater);


}


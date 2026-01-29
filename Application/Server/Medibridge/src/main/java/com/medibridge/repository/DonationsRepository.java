package com.medibridge.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.medibridge.dtos.DonationsDto;
import com.medibridge.entities.Donations;
import com.medibridge.entities.donar.Medicine;

@Repository
public interface DonationsRepository extends JpaRepository<Donations, Long> {

      boolean existsByMedicineId(Long medicineId);
      
      @Query(value = "SELECT m.* FROM donations d JOIN medicine m ON d.medicine_id = m.medicine_id WHERE d.ngo_id = :ngoId AND d.donationstatus = 'Completed'", nativeQuery = true)
      List<Medicine> getAllCompletedMedicinesByNgoId(@Param("ngoId") Long ngoId);
      @Query("""
    		    SELECT new com.medibridge.dtos.DonationsDto(
    		        d.donar.id,
    		        d.ngo.id,
    		        d.medicine.id
    		    )
    		    FROM Donations d
    		    WHERE d.medicine.id = :medicineId
    		      AND d.donationstatus = 'Pending'
    		""")
    		DonationsDto getDonationDtoByMedicineId(@Param("medicineId") Long medicineId);

     
}


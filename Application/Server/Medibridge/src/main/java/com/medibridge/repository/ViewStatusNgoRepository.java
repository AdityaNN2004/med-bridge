package com.medibridge.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.medibridge.entities.ngo.Ngo;
import com.medibridge.entities.ngo.ViewStatusNgo;

import jakarta.transaction.Transactional;

@Repository
public interface ViewStatusNgoRepository
        extends JpaRepository<ViewStatusNgo, Long> {

    Optional<ViewStatusNgo>
    findByMedicineIdAndNgoId(Long medicineId, Long ngoId);

   
    boolean existsByMedicineIdAndNgoId(Long medicineId, Long ngoId);

    @Modifying
       @Transactional
       @Query(
         value = """
           UPDATE viewstatus_ngo SET donarapproval = 'Donar_Approved',  donation_status_ngo = 'DonationProcessStarted'  WHERE medicine_id = :medicineId AND ngo_id = :ngoId
         """,nativeQuery = true)
       int updateDonationStatusToApproved( @Param("medicineId") Long medicineId, @Param("ngoId") Long ngoId);

       
       
       @Modifying
       @Transactional
       @Query(
         value = """
           UPDATE viewstatus_ngo SET donarapproval = 'Donar_Rejected',  donation_status_ngo = 'DonationProcessNotStarted'  WHERE medicine_id = :medicineId AND ngo_id = :ngoId
         """,nativeQuery = true)
       int updateDonationStatusNotApproved( @Param("medicineId") Long medicineId, @Param("ngoId") Long ngoId);


       @Query(value = "SELECT ngo_id FROM viewstatus_ngo WHERE medicine_id = :medicineId AND donarapproval = 'Donar_Approved' AND donation_status_ngo = 'DonationProcessStarted'", nativeQuery = true)
       Long getNgoIdForARequestedMedicineByMedicineIdWhichIsApprovedByDonar(@Param("medicineId") Long medicineId);
       
       @Modifying
       @Transactional
       @Query(value="INSERT INTO donations (created_on,last_updated,donationstatus,donar_id,medicine_id,ngo_id) VALUES(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,'Pending',:donarId,:medicineId,:ngoId)",nativeQuery = true)
       int updateDonation(@Param("donarId") Long donar_id,@Param("medicineId") Long medicine_id,@Param("ngoId") Long ngo_id);

       @Modifying
       @Query(value="UPDATE viewstatus_ngo SET donation_status_ngo=\"DonationCompleted\" WHERE medicine_id=:medicineId",nativeQuery = true)
       int markAsDonatedCompleted(@Param("medicineId") Long medicine_id);
       
       
       @Modifying
       @Query(value="UPDATE donations SET donationstatus=\"Completed\" WHERE medicine_id=:medicineId",nativeQuery = true)	
       int markAsDonationCompleted(@Param("medicineId") Long medicine_id);
       
       @Modifying
       @Query(value="UPDATE viewstatus_ngo SET donarapproval=\"Donar_Rejected\" , donation_status_ngo=\"DonationProcessStarted\" WHERE medicine_id=:medicineId",nativeQuery = true)
       int markAsDonationDiscarded(@Param("medicineId") Long medicine_id);
       
       @Modifying
       @Query(value="UPDATE donations SET donationstatus=\"Discarded\" WHERE medicine_id=:medicineId",nativeQuery = true)
       int markAsDiscarded(@Param("medicineId") Long medicine_id);
       
}

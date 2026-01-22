package com.medibridge.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.medibridge.entities.donar.Address;
import com.medibridge.entities.donar.Medicine;
import com.medibridge.entities.ngo.Ngo;
import com.medibridge.entities.ngo.ServiceArea;



@Repository
public interface NgoRepository extends JpaRepository<Ngo, Long> {
    Optional<Ngo> findByUser_Id(Long userId);
    boolean existsByUser_Email(String email);
    
    @Query("SELECT n.serviceArea FROM Ngo n WHERE n.id = :ngoId")
    ServiceArea findServiceAreaByNgoId(@Param("ngoId") Long ngoId);
    
    @Query(value = "SELECT DISTINCT m.* FROM medicine m JOIN viewstatus_ngo v ON v.medicine_id = m.medicine_id WHERE v.ngo_id = :ngoId AND m.donar_id = :donarId AND v.donarapproval = 'Donar_NotApproved' AND v.donation_status_ngo = 'DonationProcessNotStarted'", nativeQuery = true)
    List<Medicine> findPendingRequestMedicines(@Param("ngoId") Long ngoId, @Param("donarId") Long donarId);

    @Query(value = "SELECT DISTINCT m.* FROM medicine m JOIN viewstatus_ngo v ON v.medicine_id = m.medicine_id WHERE v.ngo_id = :ngoId AND m.donar_id = :donarId AND v.donarapproval = 'Donar_Rejected' AND v.donation_status_ngo = 'DonationProcessNotStarted'", nativeQuery = true)
    List<Medicine> findRejectedRequestMedicines(@Param("ngoId") Long ngoId, @Param("donarId") Long donarId);
    
    @Query(value = "SELECT DISTINCT m.* FROM medicine m JOIN viewstatus_ngo v ON v.medicine_id = m.medicine_id WHERE v.ngo_id = :ngoId AND m.donar_id = :donarId AND v.donarapproval = 'Donar_Approved' AND v.donation_status_ngo = 'DonationProcessStarted'", nativeQuery = true)
    List<Medicine> findOnGoingRequestMedicines(@Param("ngoId") Long ngoId, @Param("donarId") Long donarId);


    @Query(value="SELECT m.medicinecategory,COUNT(*) FROM donations d INNER JOIN medicine m WHERE m.medicine_id = d.medicine_id AND d.donationstatus=\"completed\" AND d.ngo_id=:ngoId  GROUP BY medicinecategory;",nativeQuery = true)
       List<Object[]> countMedicinesByCategoryForNgo(@Param("ngoId") Long ngo_id);
       
       @Query(value="SELECT COUNT(*)  FROM donations WHERE donationstatus=\"completed\" AND ngo_id=:ngoId ",nativeQuery = true)
       int getTotalMedicines(@Param("ngoId") Long ngo_id);

}


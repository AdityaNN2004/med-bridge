package com.medibridge.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.medibridge.dtos.DonorWithAddressDto;
import com.medibridge.dtos.NgoWithServiceAreaDto;
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
    
    @Query("SELECT new com.medibridge.dtos.NgoWithServiceAreaDto(n.id, n.organizationName, n.registrationNumber, s.companyName, s.streetAddress, s.landMark, s.city, s.district, s.state, s.zipCode, s.primaryContact, s.serviceRadius) FROM Ngo n JOIN n.serviceArea s WHERE n.id = :ngoId")
    NgoWithServiceAreaDto getNgoWithServiceAreaByNgoId(@Param("ngoId") Long ngoId);
    
    @Query("SELECT new com.medibridge.dtos.DonorWithAddressDto(d.id, d.firstName, d.lastName, a.id, a.fullAddress, a.city, a.state, a.pincode) FROM ViewStatusNgo v JOIN v.medicine m JOIN m.donar d JOIN Address a ON a.donar.id = d.id WHERE v.ngo.id = :ngoId AND m.id = :medicineId AND v.donarapproval = 'Donar_Approved' AND v.donationStatusNgo = 'DonationProcessStarted' AND a.isActive = true")
    DonorWithAddressDto getDonorWithAddressByNgoAndMedicine(@Param("ngoId") Long ngoId, @Param("medicineId") Long medicineId);

    @Modifying
    @Transactional
    @Query(value="UPDATE viewstatus_ngo  SET donarapproval=\"Donar_Rejected\" WHERE ngo_id IN (SELECT ngo_id FROM (SELECT ngo_id FROM viewstatus_ngo WHERE donarapproval=\"Donar_NotApproved\" AND donation_status_ngo=\"DonationProcessNotStarted\" AND medicine_id=3)AS temp)\r\n",nativeQuery = true)
    Long rejectedngo(@Param("medicineId") Long medicine_id);
    
    
}


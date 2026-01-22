package com.medibridge.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.medibridge.dtos.RequestedNgos;
import com.medibridge.entities.donar.Address;
import com.medibridge.entities.donar.Donar;
import com.medibridge.entities.donar.Medicine;

@Repository
public interface DonarRepository extends JpaRepository<Donar, Long> {
   boolean existsByUser_Id(Long userId);
   Optional<Donar> findByUser_Id(Long userId);
   
   @Query("SELECT d from Donar d WHERE d.user.id=:UserId AND d.user.isActive=true")
   Donar getAllUsers(@Param("UserId") Long userID);
   
   @Query("SELECT a FROM Address a WHERE a.donar.id = :donarId AND a.isActive = true")
   Address findActiveAddressByDonarId(@Param("donarId") Long donarId);

   @Query("SELECT a FROM Address a WHERE a.isActive = true")
   List<Address> findAllActiveAddress();

   
   @Modifying
   @Query(value="UPDATE address SET is_active = 0 ",nativeQuery=true)
   int inActiveAddress();
   
   @Modifying
   @Query(value="UPDATE address SET is_active = 1 where address_id = :addressId",nativeQuery=true)
    int  setActiveAddress(@Param("addressId") Long address_id);
   
   @Query(value="SELECT ngo_id, organization_name , service_area_id FROM ngo WHERE ngo_id IN (SELECT v.ngo_id FROM viewstatus_ngo v LEFT JOIN medicine m ON m.medicine_id = v.medicine_id WHERE m.medicine_id = :medicineId AND donation_status_ngo= 'DonationProcessNotStarted'AND donarapproval = 'Donar_NotApproved' );",nativeQuery=true)
   List<RequestedNgos> fetchRequestedNgoByMedicineid(@Param("medicineId") Long medicine_id);
     
   @Query(value="SELECT COUNT(*) FROM medicine WHERE donar_id=:donarId",nativeQuery = true)
   int getAllMedicineCount(@Param("donarId") Long donar_id);
}

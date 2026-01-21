package com.medibridge.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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

   @Modifying
   @Query(value="UPDATE address SET is_active = 0 ",nativeQuery=true)
  // int inActiveAddress(@Param("donarId") Long donar_id);
   int inActiveAddress();
   
   @Modifying
   @Query(value="UPDATE address SET is_active = 1 where address_id = :addressId",nativeQuery=true)
    int  setActiveAddress(@Param("addressId") Long address_id);
}
